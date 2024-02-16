"use strict"

$(document).ready(function () {

	let _apri= $("#apri");
    let _paginaIniziale= $("#paginaIniziale");  
    let _paginaDati= $("#paginaDati");

    _paginaIniziale.show();
    _paginaDati.hide();
    
    _apri.on("click", function () {
        _paginaIniziale.hide();
        _paginaDati.show();
    });
});
