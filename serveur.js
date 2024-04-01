var express = require('express');
var consolidate = require('consolidate')
var MongoClient = require('mongodb').MongoClient
var bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');
var session = require('express-session');
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectId;
var displaycalc = require('./server_scripts/display_table');
var generate = require("./server_scripts/RandomGeneration");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

var app = express ();

var length = 20;    // nombre d'éléments par page

app.engine('html', consolidate.hogan)
app.set('views','templates_dynamic');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
    secret: "NamurSur",
    saveUninitialized: true,
    cookie:{ 
        path: '/', 
        httpOnly: true
    }
}));

MongoClient.connect('mongodb://localhost:27017', (err, db) =>{
    dbo = db.db("site");
    
    if (err) throw err;
    app.get(['/display.html',"","/display", "/"], function (req, res){
        req.query.num = req.query.num || req.session.num || "1" // si pas de numéro de page défini, charge la première page
        req.session.num = req.query.num
        var sortOrder = parseInt(req.session.sort) || 0 // pas de tri par défaut
        var search = req.session.search
        if (sortOrder){
            switch(req.session.cat){
                case "utilisateur":
                    var item = {"utilisateur" : req.session.sort} // tri selon utilisateur en ordre croissant/décroissant
                    break;
                case "date": // tri selon la date en ordre croissant/décroissant
                    var item = {"date" : req.session.sort}
                    break;
            }
            dbo.collection("claims").find(search).sort(item).collation({ locale: "en", caseLevel: true }).toArray((err,doc) =>{
                if (err){
                    console.log(err)
                }
                return res.render("display.html",displaycalc.return_pages(doc,req,length))
            })
        }
        else if (search!={}){  //quand pas de tri défini par la page
            dbo.collection("claims").find(search).toArray((err,doc) =>{
                if (err){
                    console.log(err)
                }
                return res.render("display.html",displaycalc.return_pages(doc,req,length))
            })
        }
        else{ //quand pas de tri défini par la page
            dbo.collection("claims").find({}).toArray((err,doc) =>{
                if (err){
                    console.log(err)
                }
                return res.render("display.html",displaycalc.return_pages(doc,req,length))
            })
        }
    });

    app.get(['/account.html',"/account"], function (req, res){
        if (req.session.username){
            res.render("account.html")
        }
        else{
            res.redirect('log.html')
        }
    });

    app.post('/deco.html', function(req,res,next){
        req.session.username = null;
        res.redirect('log.html');
    });

    app.get(['/log.html',"/log"], function (req, res){
        if (req.session.username){
            res.redirect("account.html")
        }
        else{
            var x = req.session.error;
            req.session.error = null;
            res.render('log.html', {error : x})
        }
    });
    
    // fonction du formulaire de connexion
    app.post('/conn.html', function(req,res,next){
        console.log(req.body.username , req.body.connmdp)
        if (req.body.username != null && req.body.connmdp != null){
            var hashedPassword = bcrypt.hashSync(req.body.connmdp, 8);
            console.log("Compte cherché : ", req.body.username, hashedPassword)
            dbo.collection("users").find({username : req.body.username}).toArray((err,doc)=>{
                console.log(doc)
                if (doc.length===0){
                  req.session.error = "Utilisateur inexistant.";
                  res.redirect('log.html')
                }
                else{
                    pwd = doc[0].password;
                    console.log(pwd);
                    const verifPassword =  bcrypt.compareSync(req.body.connmdp, pwd);
                    console.log("Connected" , req.body.username , pwd)
                    console.log(verifPassword);
                    if (verifPassword){
                        req.session.username = req.body.username;
                        console.log(req.session.username)
                        res.redirect('display.html');
                    }
                    else{
                      req.session.error = "Mot de passe incorrect.";
                      res.redirect('log.html');
                    }
                }
            })
        }
        else{
            res.redirect('log.html');
        }
    });

    // fonction du formulaire d'inscription
    app.post('/insc.html', function(req,res,next){
        if (req.body.username != null && req.body.inscmdp != null){
            dbo.collection("users").find({username : req.body.username}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Compte déjà existant");
                    req.session.error = "Compte déjà existant.";
                    res.redirect('log.html')
                }
                else{
                    var hashedPassword = bcrypt.hashSync(req.body.inscmdp, 8);
                    dbo.collection("users").insertOne({username : req.body.username, password : hashedPassword})
                    console.log("Compte créé : ", req.body.username, hashedPassword)
                    req.session.username = req.body.username;
                        res.redirect('display.html');
                }
            });
        }
        else{
            res.redirect('log.html');
        }
    });
    
    // page d'affichage d'un seul incident avec ses caractéristiques et son image
    app.get(['/report.html',"/report"], function (req, res) {
        var o_id = new ObjectId(req.query.id);
        dbo.collection("claims").find({_id : o_id}).toArray((err,result)=>{
            var label = ["Voirie","Propeté publique", "Plantation", "Signalisation", "Eclairage", "Mobilier urbain", "Monument", "Véhicule"]
            var ret = [];
            for (var i = 0; i<result[0].incident.length;i++){
                if (result[0].incident[i]==null){
                    type = ""
                }
                else{
                    type = "checked" // type d'incident qu'on a coché
                }                    
                ret.push({
                    "value" : type,
                    "label" :label[i]
                })
            }
            return res.render("report.html",{
                "list" : ret,
                "description" : result[0].description,
                "utilisateur" : result[0].utilisateur,
                "adresse" : result[0].adresse,
                "urlImage" : result[0].urlImage,
                "long" : result[0].longitude,
                "lat" : result[0].latitude
            })  

        })

    });

    app.get(['/claim_report.html','/claim_report'], function (req, res){
        console.log(req.session.username)
        if (req.session.username){ // si on est connecté
            res.render("claim_report.html")
        }
        else{
            res.redirect('log.html')
        }
    });

    app.get("/upnav_site.html",function(req,res){
        return res.render("upnav_site.html", {username: req.session.username})
    })

    app.get("/footnote.html",function(req,res){
        return res.render("footnote.html")
    })

    // fonction appelée quand on veut changer l'ordre de tri
    app.get("/changesort", (req,res)=>{
        req.session.sort = -parseInt(req.session.sort) || 1 ;
        req.session.cat = req.query.cat;
        res.redirect("/")
    })

    // fonction appelée lorsque l'on entre une recherche
    app.get("/search",(req,res)=>{
        req.session.search = {$or: 
            [{ $text : { $search : req.query.searchbar,  $language: "french"}} , 
            {description: {$regex: req.query.searchbar,$options: 'i'}},
            {utilisateur: {$regex: req.query.searchbar,$options: 'i'}}]}
        res.redirect("/")
    })

    // fonction appelée lorsque l'on clique sur le logo du site => supprimer le tri, la rechercher et nous ramène à la première page
    app.get("/clearsession",(req,res)=>{
        req.session.sort = null;
        req.session.cat = null;
        req.session.search = null;
        req.session.num = null;
        res.redirect("/")
    })

    // fonction permettant d'incrémenter le numéro de page
    app.get("/nextnum",(req,res)=>{
        dbo.collection("claims").find({}).toArray((err,doc)=>{
            req.session.num = parseInt(req.session.num)+1>displaycalc.calc_pagenum(doc,length) ? req.session.num : parseInt(req.session.num)+1 // calcule le prochain numéro de page
            res.redirect("/")
        })
    })

    // fonction permettant de décrementer le numéro de page
    app.get("/previousnum",(req,res)=>{
        req.session.num = parseInt(req.session.num)-1<0 ? req.session.num : parseInt(req.session.num)-1 // calcule le précédent numéro de page
        res.redirect("/")
    })

    const upload = multer({
        dest: "dbimages"
    });

    // ajout d'un nouvel incident
    app.post("/add",upload.single("pictures"),(req,res)=>{
        const d = new Date();
        var year = (d.getFullYear()).toString();
        var month = (d.getMonth() + 1).toString();
        var day = (d.getDate()).toString();
        if (parseInt(month)<10){
            month = "0" + month
        }
        if (parseInt(day)<10){
            day = "0" + day
        }
        dbo.collection("claims").find({}).toArray((err,doc)=>{
            var countElement;
            fs.readdir("./static/uploads", (err, files) => {
                countElement = files.length;   // regarde le nombre d'images dans le dossier
                var hasImage = true
                try{
                    var tempPath = req.file.path;
                    var targetPath = path.join(__dirname, `./static/uploads/${countElement+1}image.png`);  // doit changer encore le nom pour qu'il soit unique
                    var urlImage = `./uploads/${countElement+1}image.png`;
                }catch(e){
                    hasImage = false
                    urlImage = "";
                }
                dbo.collection("claims").insertOne({"description" : req.body.description, 
                                                    "adresse" : req.body.adresse,
                                                    "incident" : [
                                                        req.body.incident1,req.body.incident2,req.body.incident3,req.body.incident4,
                                                        req.body.incident5,req.body.incident6,req.body.incident7,req.body.incident8
                                                                    ],
                                                    "latitude" : req.body.latitude,
                                                    "longitude" : req.body.longitude,
                                                    "utilisateur" : req.session.username,
                                                    "date" : `${year}/${month}/${day}`,
                                                    "urlImage" : urlImage
                })
                if (hasImage){
                    fs.rename(tempPath, targetPath, err =>{   //ajoute l'image au dossier upload se trouvant dans static
                        if (err) return error
                        console.log("uploaded")
                        res.redirect("/display")
                    });
                }
                else{
                    res.redirect("/display")
                }
            });
        })
    })

    // ajouter des événements facilement ->> à retirer
    app.get("/append", (req,res)=>{
        for (var i = 0; i<200;i++){
        dbo.collection("claims").insertOne({
            "description" : "Incident URGENT " + i, 
            "adresse": "Malware " +i, 
            "utilisateur": generate.generateUser(), 
            "date": generate.generateDate() ,
            "incident" : [null,null,null,null,null,null,null,null], 
            "urlImage" : "", 
            "latitude" : 0,
            "longitude" : 0})
        }
        res.redirect("/")
    })
    // supprimer des événements facilement ->> à retirer
    app.get("/remove", (req,res)=>{
        dbo.collection("claims").deleteMany({"description" :  /URGENT/})
        res.redirect("/")
    })

    // reset la base de donnée ->> à retirer
    app.get("/clear", (req,res)=>{
        dbo.collection("claims").deleteMany({});
        dbo.collection("users").deleteMany({});
        res.redirect("/")
    })

    // permet de créer un fichier JSON contenant tous les incidents de la base de donnée
    app.get("/serialize", (req,res) =>{
        fs.writeFileSync("exemple_db/databaseSave.json","") // clear le fichier
        dbo.collection("claims").find({}).toArray((err,doc)=>{
            if (err) console.log(err)
            var str = []
            for (let i of doc){
                str.push(JSON.stringify(i))
            }
            fs.writeFileSync("exemple_db/databaseSave.json",JSON.stringify({list : str}),(err)=>{
                console.log("Done appending")
            })
        })

         dbo.collection("users").find({}).toArray((err,doc)=>{
             if (err) console.log(err)
             var str = []
             for (let i of doc){
                 str.push(JSON.stringify(i))
             }
             fs.writeFileSync("exemple_db/databaseUsersSave.json",JSON.stringify({list : str}),(err)=>{
                 console.log("Done appending Users")
             })
         })
        res.redirect("/")
    })

    // permet de recréer la base de donnée à partir du fichier JSON sérialisé
    app.get("/deserialize", (req,res)=>{
        fs.readFile("exemple_db/databaseSave.json", (err,data)=>{
            data = JSON.parse(data)
            for (let i of data.list){
                i = JSON.parse(i)
                dbo.collection("claims").insertOne({"description" : i.description, "adresse": i.adresse, "utilisateur": i.utilisateur, "date": i.date, "incident" : i.incident, urlImage :i.urlImage, "longitude" : i.longitude, "latitude" : i.latitude})
            }
        })

        fs.readFile("exemple_db/databaseUsersSave.json", (err,data)=>{
             data = JSON.parse(data)
             for (let i of data.list){
                 i = JSON.parse(i)
                 dbo.collection("users").insertOne({"username" : i.username, "password" : i.password})
             }
         })
         
        res.redirect("/")
    })
      app.use(express.static('static'));
})

https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'ingi'
}, app).listen(8080);
