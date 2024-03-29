# Precio de la luz por hora en España a través de la API de Red Eléctrica Española
Este proyecto es una sencilla aplicación web desarrollada en __JavaScript__ que muestra el **precio por hora de la electricidad en España** utilizando la __API__ de **Red Eléctrica Española**.  <br>  
La aplicación está destinada a proporcionar **información actualizada sobre los precios de la electricidad** y **permitir a los usuarios tomar decisiones informadas sobre su consumo eléctrico**.  <br>  
###### Hecho con amor :heart: por [Akutangulo.com](http://akutangulo.com/ "Akutangulo.com") by navarr0  <br>


___
  
  Este programa tiene las siguientes funciones:  
 
  1. Obtener la fecha actual y la fecha de mañana.  
  2. Formatear las fechas en el formato necesario (ISO 8601).  
  3. Construir dinámicamente la fecha de la URL de la API de REE para que muestre siempre los datos de hoy y mañana.  
  4. Obtener los contenedores y divs donde se mostrarán los datos.  
  5. Obtener datos de la API y procesarlos.  
  6. Se ordenan los resultados obtenidos por precio en orden ascendente y se añaden ```class``` según su posición.  
  7. Se añade dinámicamente una ```class``` al ```div``` con la hora actual. Además se sustituye la hora que proporciona la API por un reloj que muestra la hora actual y se actualiza cada segundo.  
  8. Crea ```div``` para mostrar la información de cada hora y su precio correspondiente en los contenedores y ```div```.  
  9. Definir funciones para:  
      - formatear fecha.  
      - calcular el precio medio.  
  11. Crea 2 ```div``` para mostrar la información diaria con datos independientes para hoy y mañana.  
  12. Asignar una función para que al pulsar el botón ```checkbox``` oculte/muestre los ```div``` con las horas que ya han pasado.
      
Pseudocodigo: [https://akutangulo.github.io/ree/pseudocodigo.txt]
___  
Esta es la dirección de la API de Red Eléctrica Española que muestra el precio por hora de la electricidad en España en formato ISO 8601.  
[https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=YYYY-MM-DDTHH:mm&end_date=YYYY-MM-DDTHH:mm&time_trunc=hour]  


