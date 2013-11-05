$.mobile.defaultPageTransition   = 'none'
$.mobile.defaultDialogTransition = 'none'
$.mobile.buttonMarkup.hoverDelay = 0

$( document ).on( "ready", function( event ){
    //
    // Esto es para modificar el comportamiento cada vez que se le hace click a un 
    // hipervinculo que lleva a otra pagina
    $( "a" ).tap( function(event){
        event.preventDefault();
        var element = $( this )
        //
        // Si el hipervinculo al que se le hizo click tiene la clase External, 
        // es porque va a cargar un .html externo. Por lo tanto la carga se debe hacerse
        // de una manera distinta.
        //
        // De lo contrario
        // Hace el llamado correspondiente al objeto Contenido
        if( element.hasClass("external") ){
            window.location.href = element.attr( "href" )
        }else{
            $.mobile.changePage( element.attr( "href" ) )
            Contenido.cargar( element.attr("href") )
        }
    })
    //
    // Cargamos el contenido de cada sección cuando se accede a ella
    // por primera vez
    $("[data-role='page']").on("pageinit", function(){
        var page = $(this)
        Contenido.cargar(page.attr("id"))
    })
    
})




/*
    Este objeto contiene las funciones necesarias para cargar el contenido de una pagina
    despues de que cambia la url
*/
var Contenido = {

    // Carga el contenido segun la petición de página que le halla llegado
    cargar: function( href ){
        if( href == "#map-page" ){
            $.mobile.loading('show', {
                text: "Iniciando Google Maps",
                textVisible: true,
                textonly: false
            });
            MapaObjeto.inicializar( function(){
                $.mobile.loading( "hide" );
                $.mobile.loading('show', {
                    text: "Ubicando mi posición",
                    textVisible: true,
                    textonly: false
                });
                MapaObjeto.ubicarme( function(){
                    $.mobile.loading( "hide" );
                    $.mobile.loading('show', {
                        text: "Cargando puntos FNA",
                        textVisible: true,
                        textonly: false
                    });
                    MapaObjeto.cargar_todos_puntos( true, function(){
                        MapaObjeto.resize_trigger()
                        MapaObjeto.centrarme()
                        $.mobile.loading( "hide" );
                    })
                })
            })
        } else if( href ==  "#educacion" ){
            Portafolio.cargar_educacion()

        } else if( href == "#vivienda" ){
            Portafolio.cargar_vivienda()

        } else if( href == "#cesantias" ){
            Portafolio.cargar_cesantias()

        } else if( href == "#ahorro" ){
            Portafolio.cargar_ahorro()

        } else if( href == "#asesoria" ){
            if(localStorage.getItem("nombre")!= null){
                 $("#nombre").val(localStorage.getItem("nombre"));
                 $("#cedula").val(localStorage.getItem("cedula"));
                 $("#celular").val(localStorage.getItem("telefonoCelular"));
                 $("#direccion").val(localStorage.getItem("direccion"));
                 $("#email").val(localStorage.getItem("email"));
            }
        }
    }
}








/*
$.ajax({
            url: "https://www.fna.gov.co:8445/PuntuasdasdacionHackatonServiceWeb/sca/WSPuntuacionServiceExport",
            type: 'POST',
            data: {
                IdPuntoAtencion: punto.no,
                ClaseCalificacion: 'Otro',
                Calificacion: 3,
                Observaciones: 'Descripcion opcional',
                Celular: '3103184077'
            },
            success: function (data) {
                console.log(data)
            },
            error: function (x, y, z) {
                alert("Error puntuando")
            }
        });*/


function ir(idpage){
      $.mobile.changePage('#'+idpage)
    }



    /**$.ajax({
        url: 'https://www.fna.gov.co:8445/SolicitudAtencionClienteModuleWeb/sca/SolicitarAtencionWebService',
        type: 'POST',
        data: JSON.stringify({
                "externalUserId": "EUIFNA",
                "externalApplicationId": "1",
                "nombre": $("#form_info_personal input[name='nombre']").val(),
                "telefonoCelular": $("#form_info_personal input[name='celular']").val(),
                "direccion": $("#form_info_personal input[name='direccion']").val(),
                "correoElectronico": $("#form_info_personal input[name='email']").val()                
             }),
             dataType: "json",
             contentType: "application/json; charset=utf-8",
             processdata: true,
             success: function (data) {
            $.mobile.loading( "hide" );
            console.log(data);
       
        },
        error: function (x, y, z) {
            $.mobile.loading( "hide" );
            alert("Upps! Error")
        }
    });**/
