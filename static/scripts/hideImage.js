function hideImage(){
    /**
     * cache le logo d'image inconnue sur la page report.html si l'incident en question ne possède pas d'image
     */
    console.log(document.getElementById("pictures").getAttribute("src"))
    if (document.getElementById("pictures").getAttribute("src") == "."){
        $("#image").hide()
    }
}