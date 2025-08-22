document.addEventListener('DOMContentLoaded', function() {
    const csrfToken = document.querySelector('#csrf-form input[name="csrfmiddlewaretoken"]').value;
    const subscriptionData = document.getElementById('subscriptionData');
    const subscribedCodes = JSON.parse(subscriptionData.dataset.subscribed || '[]');
    
    const regions = [
        {name: "Адыгея", code: "AD"},
        {name: "Алтай", code: "AL"},
        {name: "Алтайский край", code: "ALT"},
        {name: "Амурская область", code: "AMU"},
        {name: "Архангельская область", code: "ARK"},
        {name: "Астраханская область", code: "AST"},
        {name: "Башкортостан", code: "BA"},
        {name: "Белгородская область", code: "BEL"},
        {name: "Брянская область", code: "BRY"},
        {name: "Бурятия", code: "BU"},
        {name: "Владимирская область", code: "VLA"},
        {name: "Волгоградская область", code: "VGG"},
        {name: "Вологодская область", code: "VLG"},
        {name: "Воронежская область", code: "VOR"},
        {name: "Дагестан", code: "DA"},
        {name: "Еврейская АО", code: "YEV"},
        {name: "Забайкальский край", code: "ZAB"},
        {name: "Ивановская область", code: "IVA"},
        {name: "Ингушетия", code: "IN"},
        {name: "Иркутская область", code: "IRK"},
        {name: "Кабардино-Балкария", code: "KB"},
        {name: "Калининградская область", code: "KGD"},
        {name: "Калмыкия", code: "KL"},
        {name: "Калужская область", code: "KLU"},
        {name: "Камчатский край", code: "KAM"},
        {name: "Карачаево-Черкесия", code: "KC"},
        {name: "Карелия", code: "KR"},
        {name: "Кемеровская область", code: "KEM"},
        {name: "Кировская область", code: "KIR"},
        {name: "Коми", code: "KO"},
        {name: "Костромская область", code: "KOS"},
        {name: "Краснодарский край", code: "KDA"},
        {name: "Красноярский край", code: "KYA"},
        {name: "Республика Крым", code: "CR"},
        {name: "Курганская область", code: "KGN"},
        {name: "Курская область", code: "KRS"},
        {name: "Ленинградская область", code: "LEN"},
        {name: "Липецкая область", code: "LIP"},
        {name: "Магаданская область", code: "MAG"},
        {name: "Марий Эл", code: "ME"},
        {name: "Мордовия", code: "MO"},
        {name: "Москва", code: "MOW"},
        {name: "Московская область", code: "MOS"},
        {name: "Мурманская область", code: "MUR"},
        {name: "Ненецкий АО", code: "NEN"},
        {name: "Нижегородская область", code: "NIZ"},
        {name: "Новгородская область", code: "NGR"},
        {name: "Новосибирская область", code: "NVS"},
        {name: "Омская область", code: "OMS"},
        {name: "Оренбургская область", code: "ORE"},
        {name: "Орловская область", code: "ORL"},
        {name: "Пензенская область", code: "PNZ"},
        {name: "Пермский край", code: "PER"},
        {name: "Приморский край", code: "PRI"},
        {name: "Псковская область", code: "PSK"},
        {name: "Ростовская область", code: "ROS"},
        {name: "Рязанская область", code: "RYA"},
        {name: "Самарская область", code: "SAM"},
        {name: "Санкт-Петербург", code: "SPE"},
        {name: "Саратовская область", code: "SAR"},
        {name: "Саха (Якутия)", code: "SA"},
        {name: "Сахалинская область", code: "SAK"},
        {name: "Свердловская область", code: "SVE"},
        {name: "Северная Осетия", code: "SE"},
        {name: "Смоленская область", code: "SMO"},
        {name: "Ставропольский край", code: "STA"},
        {name: "Тамбовская область", code: "TAM"},
        {name: "Татарстан", code: "TA"},
        {name: "Тверская область", code: "TVE"},
        {name: "Томская область", code: "TOM"},
        {name: "Тульская область", code: "TUL"},
        {name: "Тыва", code: "TY"},
        {name: "Тюменская область", code: "TYU"},
        {name: "Удмуртия", code: "UD"},
        {name: "Ульяновская область", code: "ULY"},
        {name: "Хабаровский край", code: "KHA"},
        {name: "Хакасия", code: "KK"},
        {name: "Ханты-Мансийский АО", code: "KHM"},
        {name: "Челябинская область", code: "CHE"},
        {name: "Чеченская Республика", code: "CE"},
        {name: "Чувашия", code: "CU"},
        {name: "Чукотский АО", code: "CHU"},
        {name: "Ямало-Ненецкий АО", code: "YAN"},
        {name: "Ярославская область", code: "YAR"},
        {name: "Луганская область", code: "LUG"},
        {name: "Донецкая область", code: "DON"},
        {name: "Херсонская область", code: "KHE"},
        {name: "Запорожская область", code: "ZAP"}
    ];

    const container = document.getElementById('regionsContainer');
    const searchInput = document.getElementById('regionSearch');
    const clearSearchBtn = document.getElementById('clearSearch');

    // Функция для обновления состояния кнопки
    function updateButtonState(button, isSubscribed) {
        button.dataset.subscribed = isSubscribed;
        button.querySelector('.btn-text').textContent = isSubscribed ? 'Отписаться' : 'Подписаться';
        button.querySelector('.btn-icon').textContent = isSubscribed ? '🔔' : '🔕';
        button.classList.toggle('subscribed', isSubscribed);
    }

    // Функция для отрисовки регионов
    function renderRegions(filter = '') {
        container.innerHTML = '';
        const searchTerm = filter.toLowerCase();
        
        regions.forEach(region => {
            if (searchTerm && !region.name.toLowerCase().includes(searchTerm)) {
                return;
            }
            
            const isSubscribed = subscribedCodes.includes(region.code);
            const card = document.createElement('div');
            card.className = 'region-card';
            card.innerHTML = `
                <div class="region-name">${region.name}</div>
                <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" 
                        data-region="${region.code}"
                        data-subscribed="${isSubscribed}">
                    <span class="btn-text">${isSubscribed ? 'Отписаться' : 'Подписаться'}</span>
                    <span class="btn-icon">${isSubscribed ? '🔔' : '🔕'}</span>
                </button>
            `;
            container.appendChild(card);
        });
    }

    // Функция для переключения подписки
    async function toggleSubscription(button) {
        const regionCode = button.dataset.region;
        const wasSubscribed = button.dataset.subscribed === 'true';
        
        button.disabled = true;
        button.classList.add('processing');
        
        try {
            const response = await fetch('/storms/toggle-subscription/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ region_code: regionCode })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Обновляем состояние кнопки согласно ответу сервера
                const isNowSubscribed = data.action === 'subscribed';
                updateButtonState(button, isNowSubscribed);
                
                // Обновляем список подписок
                const index = subscribedCodes.indexOf(regionCode);
                if (isNowSubscribed && index === -1) {
                    subscribedCodes.push(regionCode);
                } else if (!isNowSubscribed && index !== -1) {
                    subscribedCodes.splice(index, 1);
                }
                
                console.log('Subscription updated:', {
                    region: regionCode,
                    was: wasSubscribed,
                    now: isNowSubscribed,
                    subscribedCodes: subscribedCodes
                });
            } else {
                throw new Error(data.message || 'Ошибка сервера');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            // Возвращаем кнопку в исходное состояние
            updateButtonState(button, wasSubscribed);
        } finally {
            button.disabled = false;
            button.classList.remove('processing');
        }
    }

    // Обработчики событий
    searchInput.addEventListener('input', () => renderRegions(searchInput.value));
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderRegions();
        searchInput.focus();
    });
    
    container.addEventListener('click', (e) => {
        const button = e.target.closest('.subscribe-btn');
        if (button) toggleSubscription(button);
    });

    // Первоначальная отрисовка
    renderRegions();
});
