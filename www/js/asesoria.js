$(document).on("ready", function(){
	$(".btn-solicitar").tap(function(event){
		event.preventDefault()
		solicitar_llamada()
	})
})

function solicitar_llamada(){
    $.mobile.loading( 'show', {
        text: "Solicitando asesoría...",
        textVisible: true,
        textonly: false
    });

    var alerta = validar_datos();

    if(alerta == ""){
        localStorage.setItem("nombre", $("#form_info_personal input[name='nombre']").val());
        localStorage.setItem("telefonoCelular", $("#form_info_personal input[name='celular']").val());
        localStorage.setItem("direccion", $("#form_info_personal input[name='direccion']").val());
        localStorage.setItem("email", $("#form_info_personal input[name='email']").val());
        localStorage.setItem("cedula", $("#form_info_personal input[name='cedula']").val());
        $.mobile.loading( "hide" );

        //alert("En breve un asesor de fna se comunicará con usted.");
        

        //$("#nombre").val("");
        //$("#cedula").val("");
        //$("#celular").val("");
        //$("#direccion").val("");
        //$("#email").val("");

        ir("asesoria-exitosa");
     }else{
     	setTimeout(function() {
     		$.mobile.loading( "hide" );
         	ir("asesoria-error");
     	}, 500);
     }
}




function validar_datos(){
      var NoCumple = "valor";

        if ($("#form_info_personal input[name='nombre']").val() != ""){
            if($("#form_info_personal input[name='direccion']").val() != ""){
                if(solo_numeros($("#form_info_personal input[name='celular']").val())&&
                    $("#form_info_personal input[name='celular']").val()!=""){
                    if(solo_numeros($("#form_info_personal input[name='cedula']").val()) &&
                        $("#form_info_personal input[name='cedula']").val() != ""){
                        if ($("#form_info_personal input[name='email']").val() != "" &&
                            validarEmail($("#form_info_personal input[name='email']").val())){
                                 NoCumple = "";
                         }else{
                            NoCumple = "Deber diligenciar el correo correctamente"
                        }
                    }else{
                        NoCumple = "Deber diligenciar la cédula correctamente"
                    }
                }else{
                    NoCumple = "Deber diligenciar el celular correctamente"
                }
            }else{
                 NoCumple = "Deber diligenciar la dirección correctamente"
            }
        }else{
            NoCumple = "Deber diligenciar el nombre correctamente"
        }

        return NoCumple;
    }




function solo_numeros(str){
       var numeros = "0123456789"
       for (var i = 0; i < str.length; i++) {
           var c = str[i]
           if (numeros.indexOf(c) == -1){
               return false;
           }
       };
       return true;
    }




function validarEmail(email) {
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ( !expr.test(email) )
            return false;
        else
            return true;
    }