document.addEventListener('DOMContentLoaded', function() {
    const regions = [
    "Адыгея", "Алтай", "Алтайский край", "Амурская область", "Архангельская область",
    "Астраханская область", "Башкортостан", "Белгородская область", "Брянская область",
    "Бурятия", "Владимирская область", "Волгоградская область", "Вологодская область",
    "Воронежская область", "Дагестан", "Еврейская АО", "Забайкальский край", "Ивановская область",
    "Ингушетия", "Иркутская область", "Кабардино-Балкария", "Калининградская область",
    "Калмыкия", "Калужская область", "Камчатский край", "Карачаево-Черкесия", "Карелия",
    "Кемеровская область", "Кировская область", "Коми", "Костромская область", "Краснодарский край",
    "Красноярский край", "Республика Крым", "Курганская область", "Курская область", "Ленинградская область",
    "Липецкая область", "Магаданская область", "Марий Эл", "Мордовия", "Москва",
    "Московская область", "Мурманская область", "Ненецкий АО", "Нижегородская область",
    "Новгородская область", "Новосибирская область", "Омская область", "Оренбургская область",
    "Орловская область", "Пензенская область", "Пермский край", "Приморский край",
    "Псковская область", "Ростовская область", "Рязанская область", "Самарская область",
    "Санкт-Петербург", "Саратовская область", "Саха (Якутия)", "Сахалинская область",
    "Свердловская область", "Северная Осетия", "Смоленская область", "Ставропольский край",
    "Тамбовская область", "Татарстан", "Тверская область", "Томская область", "Тульская область",
    "Тыва", "Тюменская область", "Удмуртия", "Ульяновская область", "Хабаровский край",
    "Хакасия", "Ханты-Мансийский АО", "Челябинская область", "Чеченская Республика", "Чувашия",
    "Чукотский АО", "Ямало-Ненецкий АО", "Ярославская область", "Луганская область", "Донецкая область", "Херсонская область", "Запорожская область"
];

    const container = document.getElementById('regionsContainer');
    const searchInput = document.getElementById('regionSearch');
    const resultsCounter = document.createElement('div');
    resultsCounter.className = 'results-counter';
    container.parentNode.insertBefore(resultsCounter, container);

    regions.forEach(region => {
        const card = document.createElement('div');
        card.className = 'region-card';
        card.innerHTML = `
            <div class="region-name">${region}</div>
            <button class="subscribe-btn" data-region="${region}">
                <span class="btn-text">Подписаться</span>
                <span class="btn-icon">🔔</span>
            </button>
        `;
        container.appendChild(card);
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.region-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const regionName = card.querySelector('.region-name').textContent.toLowerCase();
            if (regionName.includes(searchTerm)) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        resultsCounter.textContent = `Найдено регионов: ${visibleCount} из ${regions.length}`;
    });

const clearSearch = document.getElementById('clearSearch');
clearSearch.addEventListener('click', function() {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
});


document.addEventListener('click', function(e) {
    if (e.target.closest('.subscribe-btn')) {
        const btn = e.target.closest('.subscribe-btn');
        const region = btn.getAttribute('data-region');
        const isSubscribed = btn.classList.contains('subscribed');
        
        if (isSubscribed) {
            btn.classList.remove('subscribed');
            btn.querySelector('.btn-text').textContent = 'Подписаться';
            console.log(`Отписались от ${region}`);
        } else {
            btn.classList.add('subscribed');
            btn.querySelector('.btn-text').textContent = 'Подписано';
            console.log(`Подписались на ${region}`);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    
    subscribeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            const isSubscribed = this.classList.contains('subscribed');
            
            if (isSubscribed) {

                this.classList.remove('subscribed');
                this.querySelector('.btn-text').textContent = 'Подписаться';
                console.log(`Отписались от ${region}`);
            } else {

                this.classList.add('subscribed');
                this.querySelector('.btn-text').textContent = 'Подписано';
                console.log(`Подписались на ${region}`);
                
            }
        });
    });
});

localStorage.setItem(`subscribed_${region}`, 'true');

regions.forEach(region => {
    if (localStorage.getItem(`subscribed_${region}`)) {
        const btn = document.querySelector(`[data-region="${region}"]`);
        btn.classList.add('subscribed');
        btn.querySelector('.btn-text').textContent = 'Подписано';
    }
});
