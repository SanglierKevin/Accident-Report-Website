var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function generateNumber(min,max){
    /**
     * @pre : min : un entier
     * @pre : max : un entier tel que max>min
     * @post : retourne un entier aléatoire compris dans l'interval [min,max]
     */
    if (min>max){
        throw new Exception()
    }
    return Math.floor(Math.random()*(max-min)+min)
}

function generateUser(){
    /**
     * @pre : -
     * @post : retourne un nom d'utilisateur aléatoire (lettres minuscules et majuscules sans caractères spéciaux) 
     */
    var numberletter = generateNumber(0,15)
    var user = ""
    for (var i=0; i<numberletter; i++){
        user += alphabet[generateNumber(0,52)]
    }
    return user
}

function generateDate(){
    /**
     * @pre : -
     * @post : génère une date aléatoire sous le format YYYY/MM/DD (en respectant le nombre maximum de jour par mois et en prenant en 
     * compte les années bisextiles)
     */
    const d = new Date();
    var yearactual = d.getFullYear()
    var year = generateNumber(1950,yearactual+1)
    var month = generateNumber(1,13) 
    switch (month){
        case (1):
        case (3):
        case (5):
        case (7):
        case (8):
        case (10):
        case (12):
            var day = generateNumber(1,32);
            break;
        case (4):
        case (6): 
        case (9):
        case (11):
            var day = generateNumber(1,31);
            break;
        case (2):
            if (year%4===0){
                var day = generateNumber(1,30)
            }
            else{ 
                var day = generateNumber(1,29)
            }
            break;
    }
    if (month<10){
        month = "0"+month.toString()
    }
    if (day<10){
        day = "0"+day.toString()
    }
    return `${year}/${month}/${day}`
}

module.exports = {
    "generateNumber" : generateNumber,
    "generateUser" : generateUser,
    "generateDate" : generateDate
}
