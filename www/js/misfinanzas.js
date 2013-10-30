/////////////////////////FINANZAS///////////////////////////////////////
//     device APIs are available
//

    function onDeviceReady() {
       
    }
	
	
	
    function configurar_db(){

        function execute(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS egresos (fecha_eg, valor_eg, tipo_eg, nota_eg)');
        }

        function error(error){
            console.log("Error al configurar base de datos", error)
        }

        function exito(){
            console.log("Configuración exitosa")
        }

        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(execute , error, exito);
    }


	var ing_vacios = "";
	var egr_vacios = "";
	
	
	function GuardarNuevoIngreso() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(AgregarIngreso, errorOperacion, function(){
			
			if(ing_vacios=="S"){
				alert("Debe diligenciar todos los datos. El valor debe ser numérico y sin puntos.");
			}else{		
				alert("Información Almacenada!");
				RealizarConsultaIngre();
				ir("inicio_finanzas");
			}
		});
    }
    // Populate the database
    //
    function AgregarIngreso(tx) {
        var today=new Date();
        var dia=today.getDate();
        var mes=today.getMonth()+1;
        var anio=today.getFullYear();

        var valor = $("#agregar_ingreso input[name='montoIng']").val();
        var hoy = anio+"-"+setDateZero(mes)+"-"+setDateZero(dia);
        var tipo = $("#agregar_ingreso [name='tipoIng']").val();
        var nota = $("#agregar_ingreso input[name='notaIng']").val();
		ing_vacios = "";
		
		if(valor != "" && nota != ""){

       // tx.executeSql('DROP TABLE IF EXISTS ingresos');
       // tx.executeSql('CREATE TABLE IF NOT EXISTS ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing)');
       // tx.executeSql('INSERT INTO ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing) VALUES ("'+hoy+'", "0", " - "," - ")');
       // tx.executeSql('INSERT INTO ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing) VALUES ("2014-10-01", "20014", "renta","prox anio")');
       tx.executeSql('INSERT INTO ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing) VALUES ("'+hoy+'", "'+valor+'", "'+tipo+'","'+nota+'")');
	   }else{
			ing_vacios = "S";
		}
    }
    // Transaction error callback
    //
    function errorOperacion(err) {
        console.log(err);
        alert("Error processing SQL: "+err);
    }
    // Transaction success callback
    //
    function efectuadaOperacion() {
        alert("Información Almacenada!");
        RealizarConsultaIngre();
        RealizarConsultaEgre();
    }

    function exito() {
       // alert("Ok!");
        //ir("inicio_finanzas");
		console.log("Exito")
    }
	
	function cargoHistoria() {
       console.log("Cargó Historia!");
    }

    function RealizarConsultaIngre() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(consultaIngresos, errorOperacion, exito);
    }

    function consultaIngresos(tx) {
        var fd = $("#f_desde").val();
        var fh = $("#f_hasta").val();
        tx.executeSql("SELECT * FROM ingresos WHERE fecha_ing >='" +fd+ "'AND fecha_ing <='" +fh+"'", [], ResultadosIngresos, function(error){
            console.log("consultaIngresos error: " + error)
        });
    }

    function ResultadosIngresos(tx, results) {
       var len = results.rows.length;

        $("#ingresos-tabla tbody").html("");
        
        for (var i=0; i<len; i++){
          $("#ingresos-tabla tbody").append("<tr><td>"+results.rows.item(i).tipo_ing+"</td><td>$"+results.rows.item(i).valor_ing+"</td><td>"+results.rows.item(i).fecha_ing+"</td></tr>");
        }
        $.mobile.loading( "hide" );
        RealizarSumaIngresos();
    }

    function RealizarSumaIngresos() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(SumarIngresos, errorOperacion, exito);
    }

    function SumarIngresos(tx) {
        var fd = $("#f_desde").val();
        var fh = $("#f_hasta").val();
        tx.executeSql("SELECT SUM(valor_ing) as totalIng FROM ingresos WHERE fecha_ing >='" +fd+ "'AND fecha_ing <='" +fh+"'",[], ResSumaIngresos, errorOperacion);
    }

    function ResSumaIngresos(tx, results) {
        window.ingresos = results.rows.item(0).totalIng;
    //    console.log("suma = "+ window.ingresos);
        SumarEgresos(tx);
        // $("#sActual").val(window.ingresos);
    }
    
    function setDateZero(date){
     return date < 10 ? '0' + date : date;
    }

    function listoAgregarEgreso() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(AgregarEgreso, errorOperacion, function(){
		
			if(egr_vacios=="S"){
				alert("Debe diligenciar todos los datos. El valor de ser númerico y sin puntos.");
			}else{
				alert("Información Almacenada!");
				RealizarConsultaEgre();
				ir("inicio_finanzas");
			}
		});
	}
   
   function AgregarEgreso(tx) {
        var today=new Date();
        var dia=today.getDate();
        var mes=today.getMonth()+1;
        var anio=today.getFullYear();

        var valor = $("#agregar_gasto input[name='montoEgr']").val();
        var hoy = anio+"-"+setDateZero(mes)+"-"+setDateZero(dia);
        var tipo = $("#agregar_gasto [name='tipoEgr']").val();
        var nota = $("#agregar_gasto input[name='notaEgr']").val();
		egr_vacios = "";
		if(valor != "" && nota!=""){
			tx.executeSql('INSERT INTO egresos (fecha_eg, valor_eg, tipo_eg, nota_eg) VALUES ("'+hoy+'", "'+valor+'", "'+tipo+'","'+nota+'")');
		}else{
			egr_vacios= "S";
		}
    }

    function RealizarConsultaEgre() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(consultaEgresos, errorOperacion, exito);
    }

    function consultaEgresos(tx) {
     //   console.log("Consultando egresos");
        var fd = $("#f_desde").val();
        var fh = $("#f_hasta").val();
        tx.executeSql("SELECT * FROM egresos WHERE fecha_eg >='" +fd+ "'AND fecha_eg <='" +fh+"'", [], ResultadosEgresos, function(error){
            console.log("consultaEgresos error: " + error)
        });
      //  console.log("Salió de Consultando egresos");
    }

    function ResultadosEgresos(tx, results) {
        // console.log("Entró ResultadosEgresos");

        var len = results.rows.length;
        // console.log("Egresos table: " + len + " rows found.");

        $("#egresos-tabla tbody").html("");
        
        for (var i=0; i<len; i++){
          $("#egresos-tabla tbody").append("<tr><td>"+results.rows.item(i).tipo_eg+"</td><td>$"+results.rows.item(i).valor_eg+"</td><td>"+results.rows.item(i).fecha_eg+"</td></tr>");
         //   console.log("Row = " + i + " fecha_ing = " + results.rows.item(i).fecha_eg + " Valor_ing =  " + results.rows.item(i).valor_eg + " tipo_ing =  " + results.rows.item(i).tipo_eg);
        }
        $.mobile.loading( "hide" );
        RealizarSumaIngresos();
    }

    function SumarEgresos(tx) {
       var fd = $("#f_desde").val();
       var fh = $("#f_hasta").val();
       tx.executeSql("SELECT SUM(valor_eg) as totalEg FROM egresos WHERE fecha_eg >='" +fd+ "'AND fecha_eg <='" +fh+"'",[], SaldoTotal, errorOperacion);
    }

    function SaldoTotal(tx, results) {
       // console.log("Calculando diferencia");
        var egresos = results.rows.item(0).totalEg;
        var diferencia = window.ingresos - egresos;
       // console.log("Dif: "+ diferencia);
        $("#sActual").val(diferencia);
    }

    function ir(idpage){
      $.mobile.changePage('#'+idpage)
    }

	function ir_ppal(idpage){
		window.location.href = "index.html#"+idpage;
    }
	
    function ConsultarHistoriaIngre() {
	    var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(historiaIngresos, errorOperacion, cargoHistoria);
    }

    function historiaIngresos(tx) {
        tx.executeSql("SELECT * FROM ingresos", [], ResultadoHistoriaIng, function(error){
            console.log("Error historia ingresos");
        });
    }

    function ResultadoHistoriaIng(tx, results) {
       var len = results.rows.length;
       $("#ingresos_historico tbody").html("");
        
        for (var i=0; i<len; i++){
          $("#ingresos_historico tbody").append("<tr><td>$"+results.rows.item(i).valor_ing+"</td><td>"+results.rows.item(i).fecha_ing+"</td><td>"+results.rows.item(i).tipo_ing+"</td><td>"+results.rows.item(i).nota_ing+"</td></tr>");
        }
       $.mobile.loading( "hide" );
    }

    function ConsultarHistoriaEgr() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(historiaEgresos, errorOperacion, cargoHistoria);
    }

    function historiaEgresos(tx) {
        tx.executeSql("SELECT * FROM egresos", [], ResultadoHistoriaEgr, function(error){
            console.log("Error historia egresos");
        });
    }

    function ResultadoHistoriaEgr(tx, results) {
       var len = results.rows.length;
        $("#egresos_historico tbody").html("");
        
        for (var i=0; i<len; i++){
          $("#egresos_historico tbody").append("<tr><td>$"+results.rows.item(i).valor_eg+"</td><td>"+results.rows.item(i).fecha_eg+"</td><td>"+results.rows.item(i).tipo_eg+"</td><td>"+results.rows.item(i).nota_eg+"</td></tr>");
        }
       $.mobile.loading( "hide" );
    }
	
    
	function formu_ing(tx) {
	  window.location.href = "finanzas.html#agregar_ingreso";
	  $("#agregar_ingreso input[name='montoIng']").val("");
	  $("#agregar_ingreso input[name='notaIng']").val("");
    }
	
	function formu_Egre(tx) {
	  window.location.href = "finanzas.html#agregar_gasto";
	  $("#agregar_gasto input[name='montoEgr']").val("");
	  $("#agregar_gasto input[name='notaEgr']").val("");
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

