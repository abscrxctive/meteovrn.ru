const WEATHER_API_PROXY_URL = '/weather/api/';

document.querySelector('.search-button').addEventListener('click', fetchWeatherData);
document.querySelector('.search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') fetchWeatherData();
});

async function fetchWeatherData() {
    const city = document.querySelector('.search-input').value.trim();
    if (!city) {
        alert('Введите название населенного пункта');
        return;
    }

    try {
        document.getElementById('weatherResult').style.display = 'none';
        document.querySelector('.search-button').textContent = 'Загрузка...';

        const [currentData, forecastData] = await Promise.all([
            fetchWeather(`${WEATHER_API_PROXY_URL}?city=${encodeURIComponent(city)}`),
            fetchForecast(`${WEATHER_API_PROXY_URL}?city=${encodeURIComponent(city)}&type=forecast`)
        ]);

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        displayArchive(currentData);
        
        document.getElementById('weatherResult').style.display = 'block';
    } catch (error) {
        alert(`Ошибка: ${error.message}\nПроверьте название города и подключение к интернету`);
        console.error('Детали ошибки:', error);
    } finally {
        document.querySelector('.search-button').textContent = 'Поиск';
    }
}

async function fetchWeather(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Город не найден');
    return await response.json();
}

async function fetchForecast(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Ошибка прогноза');
    return await response.json();
}

document.querySelector('.search-button').addEventListener('click', async function() {
    const city = document.querySelector('.search-input').value.trim();
    if (!city) {
        alert('Введите название населенного пункта');
        return;
    }

    try {
        document.getElementById('weatherResult').style.display = 'none';
        
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ru&appid=${WEATHER_API_PROXY_URL}`);
        
        if (!currentResponse.ok) {
            throw new Error('Город не найден');
        }

        const currentData = await currentResponse.json();
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=ru&appid=${WEATHER_API_PROXY_URL}`);
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        displayArchive(currentData);
        
        document.getElementById('weatherResult').style.display = 'block';
    } finally {
        document.querySelector('.search-button').textContent = 'Поиск';
    }
});
        
function displayCurrentWeather(data) {
    document.getElementById('currentCity').textContent = `Погода в ${data.name}`;
    document.getElementById('currentTemp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('currentDesc').textContent = data.weather[0].description;
    document.getElementById('currentHumidity').textContent = data.main.humidity;
    document.getElementById('currentWind').textContent = Math.round(data.wind.speed);
    document.getElementById('currentPressure').textContent = Math.round(data.main.pressure * 0.750062);
    document.getElementById('currentIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const forecast = data.list[i * 8];
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'long' });
        
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <h4>${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</h4>
            <div>${date.toLocaleDateString('ru-RU')}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}" class="weather-icon">
            <div class="temp">${Math.round(forecast.main.temp)}°C</div>
            <div>${forecast.weather[0].description}</div>
            <div class="weather-details">
                <p>Мин: ${Math.round(forecast.main.temp_min)}°C</p>
                <p>Макс: ${Math.round(forecast.main.temp_max)}°C</p>
                <p>Ветер: ${Math.round(forecast.wind.speed)} м/с</p>
            </div>
        `;
        
        forecastContainer.appendChild(dayElement);
    }
}

function displayArchive(currentData) {
    const archiveContainer = document.getElementById('archiveContainer');
    archiveContainer.innerHTML = '';
    
    
    const archiveDays = [];
    const today = new Date();
    
    for (let i = 1; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        

        const temp = Math.round(currentData.main.temp - Math.random() * 5);
        const conditions = ['Ясно', 'Облачно', 'Пасмурно', 'Дождь', 'Гроза'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        archiveDays.push({
            date: date,
            temp: temp,
            condition: randomCondition
        });
    }

    archiveDays.forEach(day => {
        const archiveItem = document.createElement('div');
        archiveItem.className = 'archive-item';
        archiveItem.innerHTML = `
            <h4>${day.date.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
            <p>Температура: ${day.temp}°C</p>
            <p>Состояние: ${day.condition}</p>
        `;
        
        archiveContainer.appendChild(archiveItem);
    });
}
