function calc_pagenum(list,length){
    /**
     * @pre : list : la liste des incidents
     * @pre : length : la longueur d'une page (le nombre d'incidents affiché par page)
     * @post : le nombre de pages total nécessaire pour afficher tous les incidents
     */
    num_page = (list.length-list.length%length)/length
    if (list.length%length!=0){
        num_page+=1
    }
    return num_page
}

function get_num(list,length,actual=0){
    /**
     * @pre : list : la liste des incidents
     * @pre : length : la longueur d'une page (le nombre d'incidents affiché par page)
     * @pre : actual : le numéro de la page que l'on cherche à charger
     * @post : une liste permettant d'intégrer les numéros de pages sur la template html (lien vers ce numéro et string du numéro à afficher)
     */
    num_page = calc_pagenum(list,length)
    var lst = []
    if (num_page<=6){     // si moins de 6 pages, affiche tous les numéros à la suite
        for (var i = 1; i<=num_page; i++){
            lst.push({
                "ref" : `display?num=${i}`,
                "number" : i})
        }
        return lst
    }

    // premier, deuxième, dernier et avant-dernier numéros de page toujours affichés par soucis de facilité

    // si on est au début des numéros de pages, affiche tous ceux du début à la suite ex: 1 2 3 4 ... n-1 n
    if (actual<=5){
        for (var i = 1; i<actual+3; i++){
            if (i==actual){
                lst.push({"ref" : `display?num=${i}`,
                "number" : i, "main" : "true"})
                continue;
            }
            lst.push({"ref" : `display?num=${i}`,
            "number" : i, 'main' : "false"})
        }
        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page-1}`,
        "number" : num_page-1, 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page}`,
        "number" : num_page, 'main' : "false"})
    }

    // si on est au centre des numéros de pages, affiche deux numéros de page avant et après ex: 1 2 ... 7 8 9 10 11 ... n-1 n
    if (actual>5 && actual<=num_page-5){
        lst.push({"ref" : `display?num=${1}`,
        "number" : 1, 'main' : "false"})
        lst.push({"ref" : `display?num=${2}`,
        "number" : 2, 'main' : "false"})
        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        for (var i = actual-2; i<actual+3;i++){
            if (i==actual){
                lst.push({"ref" : `display?num=${i}`,
                "number" : i, 'main' : "true"})
                continue;
            }
            lst.push({"ref" : `display?num=${i}`,
                        "number" : i, 'main' : "false"})
        }

        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page-1}`,
        "number" : num_page-1, 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page}`,
        "number" : num_page, 'main' : "false"})
    }
    
    // si on est à la fin des numéros de pages, affiche les 4 derniers ex : 1 2 ... n-3 n-2 n-1 n
    if (actual>num_page-5){
        lst.push({"ref" : `display?num=${1}`,
        "number" : 1, 'main' : "false"})
        lst.push({"ref" : `display?num=${2}`,
        "number" : 2, 'main' : "false"})
        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        for (var i = actual-2; i<=num_page;i++){
            if (i==actual){
                lst.push({"ref" : `display?num=${i}`,
                "number" : i, 'main' : "true"})
                continue;
            }
            lst.push({"ref" : `display?num=${i}`,
                        "number" : i, 'main' : "false"})
        }
    }
    // retourne la liste contenant les string des références des numéros de page ainsi que leur chiffre
    return lst
}

function return_pages(doc,req,length){
    /**
     * @pre : doc : la liste des incidents (triés ou non)
     * @pre : req : la variable permettant de déterminer les requêtes ayant été faites (notamment le numéro de page)
     * @pre : sortpages : l'ordre de tri (par défaut : pas de tri)
     * @post : un objet json pour pouvoir remplir la template associée
     */
    var length_claims = length // nombre d'incidents affichés par page
    num = get_num(doc,length_claims,parseInt(req.query.num)) // retourne la liste des numéros de page avec les bons liens
    num_page = calc_pagenum(doc,length_claims) // calcule le nombre de numéros de page
    const d = new Date();
    var year = (d.getFullYear()%100).toString();
    var month = d.getMonth()+1;
    var day = d.getDate();
    doc = doc.slice((req.query.num-1)*length_claims,(req.query.num-1)*length_claims+length_claims) // prend les éléments de [numéro_page: numéro_page+length_claims] => affiche seulement 1 page (nombre incident arbitraire) et pas toute la base de données
    for (var i = 0; i<doc.length; i++){   // inverse la date pour qu'elle soit dans le bon ordre => 20/12/1995 et non 1995/12/20
        doc[i].date = doc[i].date.split("/").reverse().join("/")
    }
    return{ // l'objet pour remplir la template
        "date" : `${day}/${month}/${year}`,
        "cat" : req.session.cat,
        "sort" : req.session.sort,
        "list" : doc,
        "numlist" : num,
    }
}

module.exports = {
    "return_pages" : return_pages,
    "get_num" : get_num,
    "calc_pagenum" : calc_pagenum
}
