/*
 * precio-luz.js escrito por Akutangulo.com by Navarr0
 * https://akutangulo.com
 */

    // Obtener la fecha actual y la de mañana
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    
    // Función para formatear la fecha (YYYY-MM-DD)
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    // Fechas en formato ISO 8601 (YYYY-MM-DDTHH:MM)
    const startDate = formatDate(currentDate) + "T00:00";
    const endDate = formatDate(tomorrowDate) + "T23:59";
    
    // Construir la URL del proxy
    const apiUrl = `proxy-ree.php?start_date=${startDate}&end_date=${endDate}`;
    console.log("🖴 URL del proxy:", apiUrl);
    
    // Contenedores donde se mostrarán los datos
    const containerToday = document.getElementById('electricity-container-today');
    const containerTomorrow = document.getElementById('electricity-container-tomorrow');
    const infoToday = document.querySelector('.informacionDiaria');
    const infoTomorrow = document.querySelectorAll('.informacionDiaria')[1];
    const currentHour = new Date().getHours();
    
    // Solicitar datos al proxy
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Extraer los datos de precios filtrados por 'Península' y con 'datetime' definido
            const selectedArea = document.getElementById('areaSelect').value;
            const pricesData = data.indicator.values.filter(item => item.geo_name === selectedArea && item.datetime);
            
            // Verificar si hay datos para mañana
            const hasDataForTomorrow = pricesData.some(item => new Date(item.datetime).getDate() === tomorrowDate.getDate());
            containerTomorrow.style.display = hasDataForTomorrow ? 'block' : 'none';
    
            // Calcular las clases según el precio para "Hoy"
            const priceValuesToday = pricesData
                .filter(item => new Date(item.datetime).getDate() === currentDate.getDate())
                .map(item => item.value);
            const priceClassesToday = Object.fromEntries(priceValuesToday
                .sort((a, b) => a - b)
                .map((val, idx) => [val, `precio${idx + 1}`]));
            
            // Calcular las clases según el precio para "Mañana"
            const priceValuesTomorrow = pricesData
                .filter(item => new Date(item.datetime).getDate() === tomorrowDate.getDate())
                .map(item => item.value);
            const priceClassesTomorrow = Object.fromEntries(priceValuesTomorrow
                .sort((a, b) => a - b)
                .map((val, idx) => [val, `precio${idx + 1}`]));
            
            // Recorrer los datos y crear los elementos para cada hora
            pricesData.forEach((item, index) => {
                const datetime = new Date(item.datetime);
                const price = item.value.toFixed(2);
                const div = document.createElement('div');
                
                // Añadir clase 'precioPasado' si la hora ya pasó
                if (index < currentHour) {
                    div.classList.add('precioPasado');
                }
                
                // Seleccionar la clase correspondiente para hoy o mañana
                const priceClasses = (datetime.getDate() === currentDate.getDate()) ? priceClassesToday : priceClassesTomorrow;
                if (priceClasses[item.value]) {
                    div.classList.add(priceClasses[item.value]);
                }
                
                // Crear span para la hora y el precio
                const timeSpan = document.createElement('span');
                if (datetime.getHours() === currentHour && datetime.getDate() === currentDate.getDate()) {
                    const clockSpan = document.createElement('span');
                    clockSpan.id = 'reloj';
                    timeSpan.appendChild(clockSpan);
                    div.id = 'precioActual';
                    updateClock();
                    setInterval(updateClock, 1000);
                } else {
                    timeSpan.innerHTML = getCurrentTime(datetime);
                }
                const priceSpan = document.createElement('span');
                priceSpan.innerHTML = (price / 1000).toFixed(3) + ' € por Kilovatio';
                div.appendChild(timeSpan);
                div.appendChild(document.createElement('br'));
                div.appendChild(priceSpan);
                
                // Agregar el div al contenedor correspondiente
                if (datetime.getDate() === currentDate.getDate()) {
                    containerToday.appendChild(div);
                } else {
                    containerTomorrow.appendChild(div);
                }
            });
            
            // Calcular el precio medio del día para hoy y mañana
            const avgPriceToday = calculateAveragePrice(pricesData, currentDate);
            const avgPriceTomorrow = calculateAveragePrice(pricesData, tomorrowDate);
            const formattedCurrentDate = formatDateInCustomFormat(currentDate);
            const formattedTomorrowDate = formatDateInCustomFormat(tomorrowDate);
            
            // Mostrar la información diaria
            infoToday.innerHTML = `<span class="precioMedioLuz">El precio medio de la luz hoy ${formattedCurrentDate} es de ${avgPriceToday} € kw</span>` +
                `<br><span class="precioLuzBarato">Precio más bajo hoy:<br> 
                    <strong style="font-size:1.5rem;">${priceValuesToday[0]}€</strong> Mw a las <strong style="font-size:1.5rem;">${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesToday[0]).datetime))}</strong></span>` +
                `<br><span class="precioLuzCaro">Precio más caro hoy:<br> 
                    <strong style="font-size:1.5rem;">${priceValuesToday[priceValuesToday.length - 1]}€</strong> Mw a las <strong style="font-size:1.5rem;">${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesToday[priceValuesToday.length - 1]).datetime))}</strong></span>`;
            
            infoTomorrow.innerHTML = `El precio medio de la luz mañana ${formattedTomorrowDate} es ${avgPriceTomorrow} € kw` +
                `<br><span class="precioLuzBarato">Precio más bajo mañana:<br>  
                    <strong style="font-size:1.5rem;">${priceValuesTomorrow[0]}€</strong> Mw a las <strong style="font-size:1.5rem;">${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesTomorrow[0]).datetime))}</strong></span>` +
                `<span class="precioLuzCaro">Precio más caro mañana:<br> 
                    <strong style="font-size:1.5rem;">${priceValuesTomorrow[priceValuesTomorrow.length - 1]}€</strong> Mw a las <strong style="font-size:1.5rem;">${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesTomorrow[priceValuesTomorrow.length - 1]).datetime))}</strong></span>`;
        })
        .catch(error => {
    console.error('Error:', error);
    containerToday.innerHTML = '<p>Error al cargar los datos. Por favor, intenta de nuevo más tarde.</p>';
});
    
    // Función para obtener la hora en formato HH:00
    function getCurrentTime(date) {
        const formattedHours = date.getHours().toString().padStart(2, '0');
        return `${formattedHours}:00`;
    }
    
    // Función para calcular el precio medio del día
    function calculateAveragePrice(prices, targetDate) {
    const pricesForDate = prices.filter(item => new Date(item.datetime).getDate() === targetDate.getDate());
    if (pricesForDate.length === 0) return 'No disponible';
    const sum = pricesForDate.reduce((total, item) => total + item.value, 0);
    return (sum / pricesForDate.length / 1000).toFixed(2);
}
    
    // Función para actualizar el reloj cada segundo
    function updateClock() {
        const clockElement = document.getElementById('reloj');
        if (clockElement) {
            const currentTime = new Date();
            const formattedTime = currentTime.getHours().toString().padStart(2, '0') + ':' +
                currentTime.getMinutes().toString().padStart(2, '0') + ':' +
                currentTime.getSeconds().toString().padStart(2, '0');
            clockElement.textContent = formattedTime;
        }
    }
    
    // Función para formatear la fecha de forma legible
    function formatDateInCustomFormat(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    }
    
    // Función para manejar el cambio del checkbox que muestra/oculta precios pasados
    function togglePrecioPasado() {
        const checkbox = document.getElementById("precioLuzPasado");
        const precioPasadoDivs = document.getElementsByClassName("precioPasado");
        for (let i = 0; i < precioPasadoDivs.length; i++) {
            precioPasadoDivs[i].style.display = checkbox.checked ? "none" : "block";
        }
    }
    
    // Asignar el evento al checkbox
    document.getElementById("precioLuzPasado").addEventListener("change", togglePrecioPasado);
