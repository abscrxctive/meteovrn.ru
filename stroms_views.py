import json

from .constants import get_region_by_code
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from django.contrib.admin.views.decorators import staff_member_required

from django.http import JsonResponse
from django.http import HttpResponse
from .forms import StormSubscriptionForm
from .models import StormPublic, StormSubscription

from .constants import REGIONS
from django_ratelimit.decorators import ratelimit

def storms(request):
    storms = StormPublic.objects.all().order_by('-created_at')
    return render(request, 'storms/storms.html', {'storms': storms})


@ratelimit(key='user', rate='25/m')
@require_POST
def toggle_subscription(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=401)
    
    try:
        data = json.loads(request.body)
        region_code = data.get('region_code')
        region = get_region_by_code(region_code)
        
        if not region:
            return JsonResponse({'status': 'error', 'message': 'Invalid region code'}, status=400)
        
        subscription = StormSubscription.objects.filter(
            user=request.user,
            region_code=region_code
        ).first()
        
        if subscription:
            subscription.is_active = not subscription.is_active
            subscription.save()
            action = 'subscribed' if subscription.is_active else 'unsubscribed'
            
        else:
            subscription = StormSubscription.objects.create(
                user=request.user,
                region_code=region_code,
                region_name=region.name,
                is_active=True
            )
            action = 'subscribed'
        
        return JsonResponse({
            'status': 'success',
            'action': action,
            'region_code': region_code,
            'is_active': subscription.is_active
        })
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)


def mail_storms(request):
    if not request.user.is_authenticated:
        return redirect('login')
    
    subscriptions = StormSubscription.objects.filter(
        user=request.user
    ).select_related('user')
    
    if request.method == 'POST':
        form = StormSubscriptionForm(request.POST)
        if form.is_valid():
            region_code = form.cleaned_data['region_code']
            if not subscriptions.filter(region_code=region_code).exists():
                StormSubscription.objects.create(
                    user=request.user,
                    region_code=region_code,
                    region_name=next((r.name for r in REGIONS if r.code == region_code), '')
                )
            return redirect('storms:mail_storms')
    else:
        form = StormSubscriptionForm()
    
    subscribed_codes = list(request.user.storm_subscriptions
                         .filter(is_active=True)
                         .values_list('region_code', flat=True))
    
    return render(request, 'storms/mail_storms.html', {
        'form': form,
        'subscriptions': subscriptions,
        'subscribed_codes': json.dumps(list(subscribed_codes)),
        'regions': REGIONS
    })

@require_POST
@staff_member_required
def send_storm_alerts(request, storm_id):
    storm = get_object_or_404(StormPublic, id=storm_id)
    if not storm.published:
        return JsonResponse({'status': 'error', 'message': 'Шторм не опубликован'}, status=400)
    
    success = storm.notify_subscribers()
    if success:
        print(f"Отправлены уведомления регионам: {storm.affected_regions}")
        return JsonResponse({'status': 'success', 'message': f'Уведомления отправлены для регионов: {", ".join(storm.affected_regions)}'})
    print("Нет подписчиков или регионов")
    return JsonResponse({'status': 'error', 'message': 'Нет подписчиков или регионов'}, status=400)

def debug_send_alert(request, storm_id):
    storm = get_object_or_404(StormPublic, id=storm_id)
    storm.notify_subscribers()
    print(f"Рассылка запущена для шторма {storm_id}")
    return HttpResponse(f"Рассылка запущена для шторма {storm_id}")
