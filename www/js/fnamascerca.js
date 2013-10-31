/***
Estos objetos y atributos están dispuestos para la manipulación,
de los mapas usados en la sección FNA Mas Cerca, de la aplicación
FNA En Tu Bolsillo
*/

/*
   Éstas variables globales, son usadas por el mapa
*/
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var info_window = new google.maps.InfoWindow({content: ''});
/*
    Éste objeto tiene todos los atributos usados para la sección mapas del FNA
*/
var MapaAtributos = {
	//
    //Ciudad donde el usuario está ubicado
    ciudad: '',
    //
    //Objeto que contiene el mapa
    mapa: null,
    //
    // Latitud y longitud de mi posición
    mi_posicion: null,
    //
    //Configuración de estilo para el mapa
    estilo_mapa: [
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#ffffff" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#090808" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "visibility": "on" },
              { "color": "#808080" },
              { "weight": 0.8 }
            ]
          },{
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              { "visibility": "on" },
              { "hue": "#ff1a00" },
              { "weight": 2 }
            ]
          },{
            "featureType": "transit.line",
            "stylers": [
              { "visibility": "on" }
            ]
          }],
    //
    //Configuración usada para el mapa
    opciones_mapa: {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(5.067132, -75.518288),
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            scrollwheel: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP,
              style: google.maps.ZoomControlStyle.DEFAULT
            },
            styles: this.estilo_mapa
    },
    //
    //Variables de uso más general de la aplicación
    general: {
            puntos_json: 'http://servicedatosabiertoscolombia.cloudapp.net/v1/Fondo_Nacional_Ahorro/puntosatencion08082013?$format=json',
            pin_persona: 'img/pines/persona.png',
            pin_fnaconcosto: 'img/pines/fna_concosto.png',
            pin_fnasincosto: 'img/pines/fna_sincosto.png',
            pin_recaudoconcosto: 'img/pines/recaudo_concosto.png',
            pin_recaudosincosto: 'img/pines/recaudo_sincosto.png',
            txt_punto_atencion: "Punto de atención FNA"
    },
    //
    //Configuración del filtro
    filtros: {
        horario_extendido: true,
        sin_costo: true,
        puntos_atencion: true,
        puntos_recaudo: true
    },
}
/*
    Éste objeto tiene todas las funciones usadas para la sección mapas del FNA
*/
var MapaObjeto = {
	//
    // inicializador
    inicializar: function(callback) {
        google.maps.visualRefresh = true;
        var map = new google.maps.Map(document.getElementById('map-canvas'), MapaAtributos.opciones_mapa);
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});
        directionsDisplay.setMap(map);
        MapaAtributos.mapa = map

        if(callback!=undefined)
            callback()
    },
    //
    // Obtiene mi posición
    obtener_mi_posicion: function(callback){
        navigator.geolocation.getCurrentPosition( function(position){
            MapaAtributos.mi_posicion = position
            if(callback!=undefined)
                callback()
        }, 
        function( error ){
            alert('Error obteniendo mi posicion! ' + error);
        });
    },
    //
    // Si ya tiene mi ubicación centra el mapa en éste punto
    centrarme: function(){
        if(MapaAtributos.mi_posicion != null){
            var punto = new google.maps.LatLng(MapaAtributos.mi_posicion.coords.latitude, MapaAtributos.mi_posicion.coords.longitude)
            MapaAtributos.mapa.setCenter(punto)
        }else{
            this.ubicarme(function(){})
        }
    },
    //
    // Ubicar mi posición en el mapa
    ubicarme: function(callback){
        if(MapaAtributos.mapa != null){

            if(MapaAtributos.mi_posicion != null){
                var position = MapaAtributos.mi_posicion
                var lat = position.coords.latitude
                var lon = position.coords.longitude
                var point = new google.maps.LatLng(lat, lon)
                var marker = new google.maps.Marker({
                    position: point,
                    title:"Yo!",
                    icon: MapaAtributos.general.pin_persona
                });
                        
                marker.setMap(MapaAtributos.mapa)
                MapaAtributos.mapa.setCenter(point)
                if(callback != undefined)
                    callback()
            }else{
                navigator.geolocation.getCurrentPosition(
                    function(position){
                        MapaAtributos.mi_posicion = position

                        var lat = position.coords.latitude
                        var lon = position.coords.longitude
                        var point = new google.maps.LatLng(lat, lon)
                        var marker = new google.maps.Marker({
                            position: point,
                            title:"Yo!",
                            icon: MapaAtributos.general.pin_persona
                        });
                        
                        marker.setMap(MapaAtributos.mapa)
                        MapaAtributos.mapa.setCenter(point)
                        if(callback != undefined)
                            callback()
                    }, 
                    function(error){
                        alert("Error obtiendo mi posición.\n" + error)
                        if(callback != undefined)
                            callback()
                    }
                );
            }
        }else{
            alert("El mapa no se cargó no se puede ubicar mi posición")
        }
    },
    //
    // Funcion que filtra el objeto según los criterios configurador MapaAtributos
    pasa_filtros: function(obj){
        var municipio = obj.municipio
        var sin_costo = obj.costodetransaccion.toUpperCase() == "GRATUITO"? true : false
        var hor_extendido = obj.horarioextendido.toUpperCase() == "NO HAY SERVICIO"? true : false
        var es_atencion = (obj.tipodeentidad).toUpperCase() == MapaAtributos.general.txt_punto_atencion.toUpperCase()? true : false

        if(MapaAtributos.filtros.horario_extendido != hor_extendido || MapaAtributos.filtros.sin_costo != sin_costo){
            return false;
        }

        if(es_atencion && MapaAtributos.filtros.puntos_atencion) return true;
        if(es_atencion == false && MapaAtributos.filtros.puntos_recaudo) return true;

        return false;
    },
    //
    // Cargar los puntos que retorna el setdatos
    cargar_todos_puntos: function(por_ciudad, callback){
        var url = MapaAtributos.general.puntos_json

        if(MapaAtributos.ciudad != '' && por_ciudad){
            url += "&$filter=municipio='"+MapaAtributos.ciudad+"'"
        }

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {
                var atencion = []
                var recaudo = []
                var ciudad = "MANIZALES"
                var es_atencion = "Punto de atención FNA"

                for (var i = 0; i < data.d.length; i++) {
                    if ((data.d[i].municipio).toUpperCase() == ciudad.toUpperCase() || ciudad == ciudad){
                        //if (that.pasa_filtros(data.d[i])){
                            var point = new google.maps.LatLng(data.d[i].latitud, data.d[i].longitud)
                            var tipo_entidad = (data.d[i].tipodeentidad).toUpperCase()
                            var ubicacion = data.d[i].direccion + " - " + data.d[i].municipio + ", " + data.d[i].departamento
                            var tiene_costo = data.d[i].costodetransaccion.toUpperCase() == "GRATUITO"? true : false
                            var documentos = data.d[i].cedulaocodigodebarras
                            var servicio = data.d[i].tipodeservicioqueofrecealafiliado
                            var hor_extendido = data.d[i].horarioextendido.toUpperCase() == "NO HAY SERVICIO"? true : false
                            var horario = data.d[i].horariodeatencion
                            var bool_atencion = tipo_entidad == es_atencion.toUpperCase()? true : false
                            var image = ""


                            if ( tipo_entidad == es_atencion.toUpperCase() ){
                                if( tiene_costo )
                                    image = MapaAtributos.general.pin_fnaconcosto;
                                else
                                    image = MapaAtributos.general.pin_fnasincosto;
                                atencion.push( data.d[i] )
                            }else{
                                if( tiene_costo )
                                    image = MapaAtributos.general.pin_recaudoconcosto;
                                else
                                    image = MapaAtributos.general.pin_recaudosincosto;
                                recaudo.push( data.d[i] )
                            }


                            var marker = new google.maps.Marker({
                                position: point,
                                title: data.d[i].tipodeentidad,
                                icon: image,
                                map: MapaAtributos.mapa,
                                clickable: true
                            });


                            marker.info  = '<div ><div class="info-window"><h2>'+ (bool_atencion? 'Punto de atención FNA': 'Punto de recaudo') +'</h2> '
                            marker.info += '<h1>'+ data.d[i].tipodeentidad +'</h1> '
                            marker.info += '<h3>'+ ubicacion +'</h3> '
                            marker.info += '<div class="info1">Costo transacción: <span>'+ data.d[i].costodetransaccion +'</span></div> '
                            marker.info += '<div class="info1">Horario de atención: <span>'+ horario +'</span></div> '
                            marker.info += '<div class="btns"><button class="boton_js" onclick="MapaObjeto.mostrar_ruta(\''+data.d[i].latitud+'\', \''+data.d[i].longitud+'\')" data-inline="true" type="button" data-theme="b">Como llegar</button> '
                            marker.info += '<a class="boton_js" href="javascript: mostrar_puntuacion()" data-inline="true" data-role="button" data-theme="b">Puntuar</a></div> </div> </div>'

                            marker.punto = data.d[i]

                            google.maps.event.addListener(marker, 'click', function() {
                                info_window.content = this.info;
                                info_window.maxWidth = 300;
                                info_window.open(this.getMap(), this);
                                MapaAtributos.mapa.panTo(this.getPosition());
                                window.punto_seleccionado = this.punto
                                $(".boton_js").buttonMarkup( "refresh" );
                            });
                    }
                }

                if(callback != undefined){
                    callback()
                }
                
            },
            error: function (x, y, z) {
                alert("Upps!. Ocurrió un error al cargar el mapa y sus puntos de atención.")
            }
        });
    },
    //
    // Carga la ruta desde mi punto de ubicacion hasta el punto fna o recaudo señalado
    mostrar_ruta: function(lat, lon){
        if(MapaAtributos.mi_posicion != null){
            var position = MapaAtributos.mi_posicion
            var start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            var end = new google.maps.LatLng(lat, lon)

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                info_window.close()
                directionsDisplay.setDirections(response);
              }
            });
        }else{
            alert("No hemos podido determinar tu ubicación.")
        }
    },
    //
    // dispara el evento de redimensionar la pantalla
    resize_trigger: function(){
    	
        google.maps.event.trigger( MapaAtributos.mapa, 'resize');
    },
}
/*
    Obtiene mi posición una vez el google maps halla cargado la libreria
*/
google.maps.event.addDomListener(window, 'load', function(){
    document.addEventListener("deviceready", function(){
        //alert("¡Dispositivo listo!")
        MapaObjeto.obtener_mi_posicion(function(){
            alert("¡Posición obtenida!")
        })
    }, false);
});