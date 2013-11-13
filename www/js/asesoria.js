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
      
  		var nombre = $("#form_info_personal input[name='nombre']").val();
  		var celular = $("#form_info_personal input[name='celular']").val();
  		var direccion = $("#form_info_personal input[name='direccion']").val();
  		var correo = $("#form_info_personal input[name='email']").val();
  		//var cc= $("#form_info_personal input[name='cedula']").val();

  		$.mobile.loading( "hide" );		

      //Llamado al web service		
  		var data =	'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:isol="http://SolicitudAtencionClienteModule/ISolicitarAtencionWebService">'+
					'<soapenv:Header/>'+
					'<soapenv:Body>'+
						'<isol:solicitarAtencionCliente>'+
							'<datosSolicitudCliente>'+
								'<externalUserId>?</externalUserId>'+
								'<!--Optional:-->'+
								'<externalApplicationId>?</externalApplicationId>'+
								'<!--Optional:-->'+
								'<afiliado>'+
									'<nombre>'+nombre+'</nombre>'+
									'<telefonoCelular>'+celular+'</telefonoCelular>'+
									'<direccion>'+direccion+'</direccion>'+
									'<!--Optional:-->'+
									'<correoElectronico>'+correo+'</correoElectronico>'+
								'</afiliado>'+
							'</datosSolicitudCliente>'+
						'</isol:solicitarAtencionCliente>'+
					'</soapenv:Body>'+
					'</soapenv:Envelope>';					
					

        var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open('POST', 'https://www.fna.gov.co:8445/SolicitudAtencionClienteModuleWeb/sca/SolicitarAtencionWebService', true);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
        xmlhttp.onreadystatechange = function () {
          $.mobile.loading( "hide" );
            if (xmlhttp.readyState == 4) {
                try {
                  var parser = new DOMParser();
                  var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                  
                  var error = xmlDoc.getElementsByTagName("codigo")[0].childNodes[0].nodeValue;
                  var error_msj = xmlDoc.getElementsByTagName("mensaje")[0].childNodes[0].nodeValue;
                  
                  if(error == "0"){
                    //navigator.notification.alert(error_msj, "", "Exito", "Aceptar")
                    $("#asesoria-exitosa .respuesta h1").html(error_msj)
                    ir("asesoria-exitosa");
                  }else{
                    navigator.notification.alert(error_msj, "", "Error", "Aceptar")
                  }
                }catch (e) {
                    navigator.notification.alert("Lo sentimos. Inténtalo de nuevo", "", "Error", "Aceptar")
                }
          }
        }
        xmlhttp.send(data);	
        

        $("#nombre").val("");
        //$("#cedula").val("");
        $("#celular").val("");
        $("#direccion").val("");
        $("#email").val("");
        
     }else{
     		 $.mobile.loading( "hide" );
			   navigator.notification.alert(alerta, "", "Error", "Aceptar")
     }
}

function validar_datos(){
      var NoCumple = "valor";

        if ($("#form_info_personal input[name='nombre']").val() != ""){
            if($("#form_info_personal input[name='direccion']").val() != ""){
                if(solo_numeros($("#form_info_personal input[name='celular']").val())&&
                    $("#form_info_personal input[name='celular']").val()!=""){
                    //if(solo_numeros($("#form_info_personal input[name='cedula']").val()) &&
                       // $("#form_info_personal input[name='cedula']").val() != ""){
                        if ($("#form_info_personal input[name='email']").val() != "" &&
                            validarEmail($("#form_info_personal input[name='email']").val())){
                                 NoCumple = "";
                         }else{
                            NoCumple = "Deber diligenciar el correo correctamente"
                        }
                    // }else{
                    //    NoCumple = "Deber diligenciar la cédula correctamente"
                    //}
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

 
    