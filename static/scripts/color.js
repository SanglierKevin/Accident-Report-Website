function changeimage(element,url){
    /**
     * @pre : element : un string représentant l'id d'une image de la page html
     * @pre : url : un lien vers un fichier png
     * @post : modifie la source de l'image possédant l'id 'element' en la passant à 'url'
     */
    document.getElementById(element).setAttribute('src',url) 
};
sessionStorage.theme = sessionStorage.theme || "light";

function loadback(){
    /**
     * fonction pour changer l'image de fond sur la page claim_report.html,
     * celle-ci passe du mode clair au mode sombre et inversément en fonction du thème actuel,
     * cette fonction est appelée au chargement de la page pour correspondre au thème déjà choisi par l'utilisateur auparavant
     */
    if (sessionStorage.theme=="dark"){
        changeimage('bl','../image/background.jpg')
        changeimage('br','../image/background.jpg')
    }
};

function changeback(){
    /**
     * fonction pour changer l'image de fond sur la page claim_report.html,
     * celle-ci passe du mode clair au mode sombre et inversément en fonction du thème actuel
     */
    if (sessionStorage.theme=="light"){
        changeimage('bl','../image/background-w.jpeg')
        changeimage('br','../image/background-w.jpeg')
    } 
    else{
        changeimage('bl','../image/background.jpg')
        changeimage('br','../image/background.jpg')
    }
};

function loadbackground(){
    /**
     * fonction modifiant les couleurs des éléments de la page en changeant la source de la stylesheet
     * -> si theme == clair => modifie la source vers le fichier css contenant la version sombre
     * -> si theme == sombre => modifie la source vers le fichier css contenant la version claire
     * cette fonction est appelée au chargement de la page en fonction du mode déjà choisi par l'utilisateur
     */
    $("#upnav").load("upnav_site.html")
    $("#footnote").load("footnote.html")
    if (sessionStorage.theme=="light"){
        document.getElementById("theme").setAttribute('href', "../style/light-version.css")
        document.getElementById("mode-type").innerHTML = "Sombre"
    } 
    else{
        document.getElementById("theme").setAttribute('href', "../style/dark-version.css")
        document.getElementById("mode-type").innerHTML = "Lumineux"
    }
};

function changebackground(){
    /**
     * fonction modifiant les couleurs des éléments de la page en changeant la source de la stylesheet
     * -> si theme == clair => modifie la source vers le fichier css contenant la version sombre
     * -> si theme == sombre => modifie la source vers le fichier css contenant la version claire
     */
    if (sessionStorage.theme=="light"){
        document.getElementById("theme").setAttribute('href', "../style/dark-version.css")
        document.getElementById("mode-type").innerHTML = "Lumineux";
        sessionStorage.theme = "dark";
        document.getElementById("mode-type").innerHTML = "Lumineux";
    } 
    else{
        document.getElementById("theme").setAttribute('href', "../style/light-version.css")
        sessionStorage.theme="light";
        document.getElementById("mode-type").innerHTML = "Sombre";
    }
};

function swapImagesColor(){
    /**
     * fonction modifiant les couleurs des différentes images de la page (passer de noir à blanc et inversément) lors de son appel,
     * les différentes images à modifier se trouvent dans la liste lst_id et les sources à changer dans les listes lst_src
     */
    // liste des ids contenant chaque image qui doit changer de couleur
    var lst_id = ['plus',"utilisateur","date","previous","next"]
    // liste des sources des images en version blanche/noire selon la liste (b=black, w=white)
    var lst_src_b = ['../image/plus-black.png',"../image/right-arrow-solid-b.png","../image/right-arrow-solid-b.png","../image/left-arrow-b.png","../image/right-arrow-b.png"]
    var lst_src_w = ['../image/plus-white.png',"../image/right-arrow-solid-w.png","../image/right-arrow-solid-w.png","../image/left-arrow-w.png","../image/right-arrow-w.png"]
    for (var i = 0;i<lst_id.length;i++){
        if (sessionStorage.theme == "light"){
            changeimage(lst_id[i],lst_src_b[i])
        }
        else{
            changeimage(lst_id[i],lst_src_w[i])
        }
    }
}

function loadImagesColor(){
    /**
     * fonction modifiant les couleurs des différents éléments au chargement de la page
     * en fonction du theme qui a été choisi préalablement
     */
    if (sessionStorage.theme == "dark"){
        swapImagesColor();
    }
}

function changemode(){
    /**
     * fonction permettant de changer le thème sur la page display.html en appuyant sur le bouton "changer de mode",
     * celle-ci va modifier la couleur de fond en changeant la feuille css et modifie les images en passant à leur version blanche/noire
     * en fonction du thème adopté
     */
    changebackground();
    swapImagesColor();
}

function loadmode(){
    /**
     * fonction permettant de changer le thème sur la page display.html au chargement pour correspondre à celui déjà choisi par l'utilisateur
     * sur les autres pages (ne pas changer de thème à chaque rafraichissement de page),
     * celle-ci va modifier la couleur de fond en changeant la feuille css et modifie les images en passant à leur version blanche/noire
     * en fonction du thème adopté.
     */
    loadbackground();
    loadImagesColor();
}
