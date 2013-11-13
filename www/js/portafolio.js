/*
Contiene las funciones necesarias para cargar el contenido de
*/


var Portafolio = {
    //
    // Carga la información de educación en la página respectiva.
    cargar_educacion: function(){
        
        $.mobile.loading( 'show', {
            text: "Consultando información educación...",
            textVisible: true,
            textonly: false
        });
        $.getJSON( "data/info_educacion.json", function( data ) {
            $("#titulo_edu").html(data.titulo)
            $("#contenido_edu").html(data.contenido)
            $("#imagen_edu").attr('src',data.imagen)
            $.mobile.loading( "hide" );
        });
    },
    //
    // Carga la información de vivienda en la página respectiva.
    cargar_vivienda: function(){
        $.mobile.loading( 'show', {
            text: "Consultando información vivienda...",
            textVisible: true,
            textonly: false
        });
        $.getJSON( "data/info_vivienda.json", function( data ) {
            $("#titulo_viv").html(data.titulo)
            $("#contenido_viv").html(data.contenido)
            $("#imagen_viv").attr('src',data.imagen)
            $.mobile.loading( "hide" );
        });
    },
    //
    // Carga la información de vivienda en la página respectiva.
    cargar_ahorro: function(){
        $.mobile.loading( 'show', {
            text: "Consultando información ahorro...",
            textVisible: true,
            textonly: false
        });
        $.getJSON( "data/info_ahorro.json", function( data ) {
            $("#titulo_aho").html(data.titulo)
            $("#contenido_aho").html(data.contenido)
            $("#imagen_aho").attr('src',data.imagen)
            $.mobile.loading( "hide" );
        });
    },
    //
    // Carga la información de vivienda en la página respectiva.
    cargar_cesantias: function(){
        $.mobile.loading( 'show', {
            text: "Consultando información cesantías...",
            textVisible: true,
            textonly: false
        });
        
        $.getJSON( "data/info_cesantias.json", function( data ) {
            $("#titulo_ces").html(data.titulo)
            $("#contenido_ces").html(data.contenido)
            $("#imagen_ces").attr('src',data.imagen)
            $.mobile.loading( "hide" );
        });
    },
}