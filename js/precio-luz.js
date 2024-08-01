/*
 * precio-luz.js escrito por Akutangulo.com by Navarr0
 * https://akutangulo.com
 */
// Obtener la fecha actual
const currentDate = new Date();
// Obtener la fecha de mañana
const tomorrowDate = new Date(currentDate);
tomorrowDate.setDate(currentDate.getDate() + 1);
// Función para formatear la fecha en el formato YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
// Formatear las fechas en el formato necesario (YYYY-MM-DDTHH:mm) -> ISO 8601
const startDate = formatDate(currentDate) + "T00:00";
const endDate = formatDate(tomorrowDate) + "T23:59";
// Construir la URL de la API con las fechas dinámicas en formato ISO 8601
const apiUrl = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${startDate}&end_date=${endDate}&time_trunc=hour`;
console.log("🖴 URL de la API de REE:", apiUrl); // Mostrar la URL de la API de Red Eléctrica Española en la consola de la web app 
// Obtener los contenedores donde se mostrarán los precios de hoy y mañana
const containerToday = document.getElementById('electricity-container-today');
const containerTomorrow = document.getElementById('electricity-container-tomorrow');
// Obtener los divs de información diaria
const infoToday = document.querySelector('.informacionDiaria');
const infoTomorrow = document.querySelectorAll('.informacionDiaria')[1];
// Obtener la hora actual
const currentHour = new Date().getHours();
// Obtener los datos de la API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {         
        // Obtener los datos de los precios de electricidad
        const pricesData = data.included.find(item => item.type === 'PVPC (\u20ac/MWh)').attributes.values;        
        // Verificar si hay datos para mañana
        const hasDataForTomorrow = pricesData.some(item => new Date(item.datetime).getDate() === tomorrowDate.getDate());           
        // Ocultar el contenedor de mañana si no hay datos
        containerTomorrow.style.display = hasDataForTomorrow ? 'block' : 'none';         
        // Calcular las clases basadas en el precio para "Hoy"
        const priceValuesToday = pricesData
            .filter(item => new Date(item.datetime).getDate() === currentDate.getDate())
            .map(item => item.value);

        const priceClassesToday = Object.fromEntries(priceValuesToday
            .sort((a, b) => a - b)
            .map((val, idx) => [val, `precio${idx + 1}`]));        
        // Calcular las clases basadas en el precio para "Mañana"
        const priceValuesTomorrow = pricesData
            .filter(item => new Date(item.datetime).getDate() === tomorrowDate.getDate())
            .map(item => item.value);

        const priceClassesTomorrow = Object.fromEntries(priceValuesTomorrow
            .sort((a, b) => a - b)
            .map((val, idx) => [val, `precio${idx + 1}`]));
        
        // Recorrer los datos y agregar divs al contenedor correspondiente
        pricesData.forEach((item, index) => {
            const datetime = new Date(item.datetime);
            const price = item.value.toFixed(2);
            const div = document.createElement('div'); 
            
            // Agregar clase "precioPasado" si la hora ya ha pasado
            if (index < currentHour) {
                div.classList.add('precioPasado');
            }
            
            // Calcular la clase basada en el precio actual para "Hoy" o "Mañana"
            const priceClasses = (new Date(item.datetime).getDate() === currentDate.getDate()) ? priceClassesToday : priceClassesTomorrow;
            if (priceClasses[item.value]) {
                div.classList.add(priceClasses[item.value]);
            }
            
            // Crear elementos span para mostrar la hora y el precio
            const timeSpan = document.createElement('span');
            if (index === currentHour) {
                const clockSpan = document.createElement('span');
                clockSpan.id = 'reloj';
                timeSpan.appendChild(clockSpan);
                div.id = 'precioActual'; // Agrega el id 'precioActual' al div de la hora actual
                updateClock(); // Llama a updateClock inmediatamente para mostrar la hora actual
                setInterval(updateClock, 1000); // Actualiza el reloj cada segundo
            } else {
                timeSpan.innerHTML = getCurrentTime(datetime);
            }            
            const priceSpan = document.createElement('span');
            priceSpan.innerHTML = (price / 1000).toFixed(3) + ' € por Kilovatio';
            
            // Agregar los elementos span al div
            div.appendChild(timeSpan);
            div.appendChild(document.createElement('br'));
            div.appendChild(priceSpan);
            
            // Agregar el div al contenedor correspondiente
            if (new Date(item.datetime).getDate() === currentDate.getDate()) {
                containerToday.appendChild(div);
            } else {
                containerTomorrow.appendChild(div);
            }
        });
        
        // Calcular el precio medio del día para "Hoy" y "Mañana"
        const avgPriceToday = calculateAveragePrice(pricesData, currentDate);
        const avgPriceTomorrow = calculateAveragePrice(pricesData, tomorrowDate);        
        // Formatear la fecha en el formato deseado
        const formattedCurrentDate = formatDateInCustomFormat(currentDate);
        const formattedTomorrowDate = formatDateInCustomFormat(tomorrowDate);
        
        // Mostrar la información en los divs de información diaria
        infoToday.innerHTML = `<span class="precioMedioLuz">El precio medio de la luz hoy ${formattedCurrentDate} es de ${avgPriceToday} €</span><br>` +
            `<br><span class="precioLuzBarato">${priceValuesToday[0]} € Precio más barato hoy a las ${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesToday[0]).datetime))}</span><br>` +
            `<br><span class="precioLuzCaro">Precio más caro hoy: ${priceValuesToday[priceValuesToday.length - 1]} € a las ${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesToday[priceValuesToday.length - 1]).datetime))}</span>`;

        infoTomorrow.innerHTML = `El precio medio de la luz mañana ${formattedTomorrowDate} es ${avgPriceTomorrow} €<br>` +
            `<br><span class="precioLuzBarato">${priceValuesTomorrow[0]} € Precio más barato mañana a las ${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesTomorrow[0]).datetime))}</span>` +
            `<span class="precioLuzCaro">Precio más caro mañana: ${priceValuesTomorrow[priceValuesTomorrow.length - 1]} € a las ${getCurrentTime(new Date(pricesData.find(item => item.value === priceValuesTomorrow[priceValuesTomorrow.length - 1]).datetime))}</span>`;
    })
    .catch(error => console.error('Error:', error));

// Función para obtener la hora actual en formato HH:00
function getCurrentTime(date) {
    const formattedHours = date.getHours().toString().padStart(2, '0');
    return `${formattedHours}:00`;
}

// Función para calcular el precio medio del día
function calculateAveragePrice(prices, targetDate) {
    const pricesForDate = prices.filter(item => new Date(item.datetime).getDate() === targetDate.getDate());
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

// Función para formatear la fecha en el formato de informacionDiaria
function formatDateInCustomFormat(date) {
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    return date.toLocaleDateString('es-ES', options);
}

// Función para manejar el cambio en el estado del botón-checkbox
function togglePrecioPasado() {
    const checkbox = document.getElementById("precioLuzPasado");
    const precioPasadoDivs = document.getElementsByClassName("precioPasado");

    for (let i = 0; i < precioPasadoDivs.length; i++) {
        precioPasadoDivs[i].style.display = checkbox.checked ? "none" : "block";
    }
}

// Asigna la función al evento de cambio del checkbox
document.getElementById("precioLuzPasado").addEventListener("change", togglePrecioPasado);
