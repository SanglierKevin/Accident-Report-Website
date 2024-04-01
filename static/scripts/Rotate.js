function rotate(cat,sort){
    /**
     * @pre : cat : la catégorie du tri (sur les utilisateurs ou sur la date)
     * @pre : sort : l'ordre de tri (croissant/décroissant)
     * @post : fonction permettant de faire pivoter les flèches dans l'entête du tableau en fonction du type de tri 
     * et de l'ordre de tri
     */
    $("#"+cat).css('-webkit-transform',`rotate(${90*sort}deg)`); 
    $("#"+cat).css('-moz-transform',`rotate(${90*sort}deg)`);
    $("#"+cat).css('transform',`rotate(${90*sort}deg)`);
}

function handleSort(){
    /**
     * fonction permettant d'appeler la rotation des flèches et permettant de bouger de page en fonction de la touche du clavier pressée
     */
    cat = document.getElementById("cat").value
    sort = parseInt(document.getElementById("sort").value)
    if (cat!="" && sort!=""){
        rotate(cat,sort);
    }
    $("body").keydown(function (e){ 
        switch (e.which){
            case 37: // flèche de gauche du clavier <--
                window.location = "/previousnum";
                break;
            case 39: // flèche de droite du clavier -->
                window.location = "/nextnum";
                break;
        }
    });
}
