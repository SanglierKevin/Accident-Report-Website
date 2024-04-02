# LINFO1212_P

## Introduction
Pour ce projet, nous avons dû réaliser un [site](https://moodle.uclouvain.be/pluginfile.php/200000/mod_resource/content/21/0%20Description%20du%20cours.pdf) reprenant trois pages : 
- Une page de présentation des incidents
- Une page d'ajout des incidents
- Une page de connexion/d'inscription

Ces pages doivent être dynamiques et pouvoir afficher les incidents en fonction de ceux qui sont stockés dans notre base de données.
Nous devons également pouvoir stocker dans cette base de données les données de l'utilisateur ou pouvoir ajouter un incident à la liste de ceux déjà présents.
Ces informations peuvent être ajoutés via la page de connexion/d'inscription mais également de la page d'ajout d'incidents.

Nous sommes également libres d'ajouter des caractéristiques supplémentaires au site qui sont listées ci-dessous:
- L'affichage d'un nombre limité d'incidents par page et donc création de numéros de page
- La possibilité d'afficher les incidents de manière triée (selon l'utilisateur ou bien la date)
- Une page supplémentaire pour afficher les caractéristiques spécifiques à un incident (sa localisation Google Maps ou une Image entre autre)
- L'ajout de types spécifiques d'incidents et de catégories sélectionnables sur la page d'ajout
- Auto-complétion de l'adresse grâce à l'outil Google Maps
- La possibilité d'ajouter une image à l'incident
- Thème sombre/ clair entre lesquels on peut basculer

## Description de l'organisation des fichiers

```bash
|
|── database                  : dossier contenant la base de données et les données liées
|── exemple_db                : dossier contenant un fichier json pour ajouter des incidents type à la base de données ainsi que les sérialiations   
|── node_modules              : dossier contenant les modules utilisés dans ce projet
|── server_scripts            : dossier contenant les fonctions utiles pour le serveur (formatage de string et autres outils du genre)
|── static                    : dossier contenant les différents fichier statics (typiquement les css, scripts clients et images)
|    |
|    |── favicon_io           : dossier contenant les icônes s'affichant dans l'onglet du navigateur
|    |── image                : dossier contenant les images utilisées par les différentes pages du site
|    |── scripts              : dossier contenant les scripts côté du client du site
|    |── style                : dossier contenant toutes les feuilles de style
|    |── uploads              : dossier contenant les images ayant été téléchargées par les utilisateurs
|
| templates_dynamic           : dossier contenant les différentes pages html visant à être complétées
| serveur.js                  : fichier gérant le fonctionnement du serveur et ses méthodes
```

## Prérequis d'installation

Avant de pouvoir lancer notre site, assurez vous bien d'avoir installé les outils suivants:
- Node.js que vous pouvez télécharger et installer à [cette adresse](https://nodejs.org/fr/download/)
- MongoDB que vous pouvez télécharger à [cette adresse](https://www.mongodb.com/try/download/community?jmp=docs)
- Les outils MongoDB que vous pouvez télécharger à [cette adresse](https://www.mongodb.com/try/download/database-tools)

Assure-vous de bien rajouter les localisations de ces fichiers à la variable d'environnement ```PATH``` pour pouvoir utiliser leurs mots-clés dans l'invite de commande.

## Lancement du site


### Premier Lancement
Pour lancer le site, lancez tout d'abord la commande suivante dans votre invite de commande :
```bash
$ mongod --dbpath (chemin/ou/vous/avez/mis/le/dossier/LINFO1212_p)/database
```

Initialisez ensuite cette base de données en lançant à partir du dossier exemple_db la commande suivante : 
```bash
(chemin/ou/vous/avez/mis/le/dossier/LINFO1212_p)/exemple_db>mongoimport -d site -c claims example.json
```

Vous devez ensuite, alors que la base de données est connectée, rajouter les index de recherche à celle-ci. Pour cela, lancez les commandes suivantes 
dans une autre invite de commande : 
```bash
$mongo
$use site
$db.claims.createIndex({ description : "text", adresse : "text", utilisateur : "text", date : "text"})
$db.claims.createIndex({ description : 1})
$db.claims.createIndex({ utilisateur : 1})
```

(Si vous voulez supprimer les évènements tests ajoutés, rendez-vous à [cette section](#Description-des-commande-de-gestion-de-la-base-de-données))

Vérifiez bien que le serveur de la base de données soit lancé et en attente de requête sur le port 27070.

Par la suite, lancez le serveur en lançant la commande suivante dans votre console. Attention, assurez-vous bien de vous trouver dans le dossier contenant notre projet.

```bash
(chemin/ou/vous/avez/mis/le/dossier/LINFO1212_p)> node serveur.js
```

Il ne vous reste alors plus qu'à vous rendre dans votre navigateur préféré et taper l'url ```localhost:8080``` pour accéder à notre site.

### Lancements ultérieurs

Pour lancer le site à partir de la deuxième fois, soit vous pouvez taper à nouveaux les commandes citées-ci [dessus](#Premier-Lancement) (mais vous ne devez plus lancer le ```mongoimport```) ou bien, vous pouvez lancer la commande suivante:

```bash
(chemin/ou/vous/avez/mis/le/dossier/LINFO1212_p)> npm run start
```

## Se fournir une clé API pour l'utilisation du service Google Maps

Pour utiliser l'autocomplétion et l'affichage de la carte, vous devrez vous fournir une clé API provenant de chez Google.

Pour cela, nous vous redirigeons vers cette [page](https://developers.google.com/maps/documentation/javascript/get-api-key) qui vous expliquera comment vous en fournir une.

Vous n'aurez ensuite plus qu'à entrer cette clé dans la ligne 23 de [claim_report.html](/templates_dynamic/claim_report.html) et la ligne 24 de [report.html](/templates_dynamic/report.html) et vous aurez accès aux services de Google Maps

## Description des commandes de gestion de la base de données

Nous avons décidé de rajouter des fonctions pour faciliter la gestion de la base de données et ainsi pouvoir tester sa bonne efficacité.

Nous vous prévenons d'abord de désactiver (en modifiant les commandes annotées dans [serveur.js]((https://github.com/Aperence/LINFO1212_P/blob/master/serveur.js))) ces fonctionnalités si vous souhaitez mettre en ligne ce site, au risque de laisser à quelconque utilisateur la capacité de modifier drastiquement et de manière irréversible la base de données.

Ces fonctionnalités sont toutes disponibles directement dans le navigateur en entrant en URL ```localhost:8080/(commande)```
Les fonctionnalités disponibles sont : 
- append : rajoute 200 éléments ayant une date et un utilisateur aléatoires à la base de données 
- remove : supprime les éléments qui ont été rajoutés grâce à la commande ```append```
- clear : supprime tous les évènements de la base de données
- serialize : crée un fichier JSON nommé databaseSave.json se trouvant dans exemple_db et reprenant tous les évènements se trouvant dans la base de données => utile pour pouvoir transférer la base de données vers un autre serveur (Attention, cette méthode écrase le contenu de databseSave.json si celui-ci n'est pas vide)
- deserialize : va chercher le fichier JSON nommé databaseSave.json se trouvant dans exemple_db et ayant la même structure (```{list : [element1,element2,...]}```) avec element qui sont des objets JSON) et ajoute tous ces éléments à la base de données.

## Description des pages et des fichiers utiles pour celles-ci

### Page de présentation des incidents

Cette page repose sur plusieurs fichiers:

#### Fichiers HTML
- le fichier [templates_dynamic/display.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/display.html) qui gère la structure du site
- le fichier [templates_dynamic/upnav.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/upnav.html) qui s'occupe de la structure de la barre de navigation supérieure.

#### Fichiers CSS
- le fichier [static/style/upnav.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/upnav.css) qui est réservé à la mise en page de la navigation supérieure
- le fichier [static/style/display-body.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/display-body.css) qui s'occupe de la mise en page des éléments du corps de la page (excepté le tableau des incidents)
- le fichier [static/style/display/table.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/display-table.css) qui affiche la mise en page du tableau d'incidents
- le fichier [static/style/light-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/light-version.css) qui gère les couleurs de la page en version claire
- le fichier [static/style/dark-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/dark-version.css) qui gère les couleurs de la page en version sombre

#### Fichiers JS
- le fichier [static/scripts/color.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/color.js) qui s'occupe du changement de mode clair à mode sombre, du changement de couleur des images et de charger le mode adéquatement avec celui choisi sur les autres pages (load le mode)
- le fichier [static/scripts/Rotate.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/Rotate.js) qui s'occupe de la rotation des flèches en accord avec le type de tri qui est choisi
- le fichier [server_scripts/display_table.js](https://github.com/Aperence/LINFO1212_P/blob/master/server_scripts/display_table.js) qui s'occupe de renvoyer les informations nécessaires pour pouvoir compléter la template ```display.html``` en fonction du numéro de page et du tri choisi par l'utilisateur
- le fichier [serveur.js](https://github.com/Aperence/LINFO1212_P/blob/master/serveur.js) qui s'occupe des redirections et des appels aux méthodes côté serveur
 
#### Autres
- le dossier [static/image](https://github.com/Aperence/LINFO1212_P/blob/master/static/image) qui contient toutes les images du site (N.B. : pour les sources de ces images, n'hésitez pas à aller consulter le site [Boxicons](https://boxicons.com/))
- le dossier [static/favicon_io](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io) qui contient les images de l'icône ![icone](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io/favicon-16x16.png) dans l'onglet de la fenêtre


Nous avons aussi décidé d'utiliser ```display:flex``` afin de permettre au site d'être le plus flexible possible et de pouvoir s'adapter en fonction de la largeur de la fenêtre ouverte.
Vous pouvez également sur cette page utiliser les flèches gauche et droite de votre clavier pour naviguer entre les pages.
De plus, en cliquant sur les descriptions des incidents, vous serez redirigé vers la page ```report``` correspondant à cet incident et vous affichant ses caractéristiques.

### Page d'ajout d'incident

Cette page repose sur les fichiers suivants:

#### Fichiers HTML
- le fichier [templates_dynamic/claim_report.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/claim_report.html) qui gère la structure de la page
- le fichier [templates_dynamic/upnav.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/upnav.html) qui s'occupe de la structure de la barre de navigation supérieure.

#### Fichiers CSS
- le fichier [static/style/upnav.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/upnav.css) qui est réservé à la mise en page de la navigation supérieure
- le fichier [static/style/claim_report.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/claim_report.css) qui s'occupe de la mise en page des cadres pour ajouter un incident
- le fichier [static/style/light-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/light-version.css) qui gère les couleurs de la page en version claire (Fonctionnalité pas encore implémentée)
- le fichier [static/style/dark-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/dark-version.css) qui gère les couleurs de la page en version sombre (Fonctionnalité pas encore implémentée)

#### Fichiers JS
- le fichier [static/scripts/color.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/color.js) qui s'occupe du changement de mode clair à mode sombre, du changement de couleur des images et de charger le mode adéquatement avec celui choisi sur les autres pages (load le mode)
- le fichier [static/scripts/log.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/log.js) qui vérifie que les deux mots de passes entrés par l'utilisateur sont bien identiques et permettant aussi d'afficher le mot de passe
- le fichier [serveur.js](https://github.com/Aperence/LINFO1212_P/blob/master/serveur.js) qui s'occupe des redirections et des appels aux méthodes côté serveur

#### Autres
- le dossier [static/favicon_io](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io) qui contient les images de l'icône ![icone](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io/favicon-16x16.png) dans l'onglet de la fenêtre

Cette page est dédiée à l'ajout d'un incident en remplissant un form composé d'une description de l'incident, d'une date de l'incident, du compte de l'utilisateur mais également d'une photo possible de l'incident (*fonctionnalité supplémentaire*) ainsi que le type d'accident dont il s'agit (*fonctionnalité supplémentaire*).

### Page de connexion au compte utilisateur

Pour cette page, nous avons utilisé les fichiers suivants:

#### Fichiers HTML
- le fichier [static/templates_dynamic/log.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/log.html) qui gère la structure de la page de connexion
- le fichier [templates_dynamic/upnav.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/upnav.html) qui s'occupe de la structure de la barre de navigation supérieure.

#### Fichiers CSS
- le fichier [static/style/upnav.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/upnav.css) qui est réservé à la mise en page de la navigation supérieure
- le fichier [static/style/log.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/log.css) qui gère la mise en page des cadres de connexion et d'inscription
- le fichier [static/style/light-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/light-version.css) qui gère les couleurs de la page en version claire (Fonctionnalité pas encore implémentée)
- le fichier [static/style/dark-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/dark-version.css) qui gère les couleurs de la page en version sombre (Fonctionnalité pas encore implémentée)

#### Fichiers JS
- le fichier [static/scripts/color.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/color.js) qui s'occupe du changement de mode clair à mode sombre, du changement de couleur des images et de charger le mode adéquatement avec celui choisi sur les autres pages (load le mode)
- le fichier [static/scripts/maps.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/maps.js) permettant d'ajouter la fonction d'auto-complétion d'adress de Google Maps
- le fichier [serveur.js](https://github.com/Aperence/LINFO1212_P/blob/master/serveur.js) qui s'occupe des redirections et des appels aux méthodes côté serveur

#### Autres
- le dossier [static/image](https://github.com/Aperence/LINFO1212_P/blob/master/static/image) qui contient toutes les images du site (N.B. : pour les sources de ces images, n'hésitez pas à aller consulter le site [Boxicons](https://boxicons.com/))
- le dossier [static/favicon_io](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io) qui contient les images de l'icône ![icone](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io/favicon-16x16.png) dans l'onglet de la fenêtre

Cette page-ci est vouée à la connexion d'un utilisateur à son compte ou à la création d'un compte si celui-ci n'en possède pas.


### Page d'afichage des caractéristiques des incidents

Pour cette page, nous avons utilisé les fichiers suivants:

#### Fichiers HTML
- le fichier [static/templates_dynamic/report.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/report.html) qui gère la structure de la page de connexion
- le fichier [templates_dynamic/upnav.html](https://github.com/Aperence/LINFO1212_P/blob/master/templates_dynamic/upnav.html) qui s'occupe de la structure de la barre de navigation supérieure.

#### Fichiers CSS
- le fichier [static/style/upnav.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/upnav.css) qui est réservé à la mise en page de la navigation supérieure
- le fichier [static/style/claim_report.css](https://github.com/Aperence/LINFO1212_P/blob/master/static/style/claim_report.css) qui s'occupe de la mise en page d'affichage des caractéristiques
- le fichier [static/style/light-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/light-version.css) qui gère les couleurs de la page en version claire (Fonctionnalité pas encore implémentée)
- le fichier [static/style/dark-version.css](https://github.com/Aperence/LINFO1212_P/tree/master/static/style/dark-version.css) qui gère les couleurs de la page en version sombre (Fonctionnalité pas encore implémentée)

#### Fichiers JS
- le fichier [static/scripts/color.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/color.js) qui s'occupe du changement du mode clair au mode sombre, du changement de couleur des images et de charger le mode adéquatement avec celui choisi sur les autres pages (load le mode)
- le fichier [static/scripts/maps.js](https://github.com/Aperence/LINFO1212_P/blob/master/static/scripts/maps.js) permettant d'ajouter l'affichage de la carte Google Maps
- le fichier [serveur.js](https://github.com/Aperence/LINFO1212_P/blob/master/serveur.js) qui s'occupe des redirections et des appels aux méthodes côté serveur

#### Autres
- le dossier [static/image](https://github.com/Aperence/LINFO1212_P/blob/master/static/image) qui contient toutes les images du site (N.B. : pour les sources de ces images, n'hésitez pas à aller consulter le site [Boxicons](https://boxicons.com/))
- le dossier [static/favicon_io](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io) qui contient les images de l'icône ![icone](https://github.com/Aperence/LINFO1212_P/blob/master/static/favicon_io/favicon-16x16.png) dans l'onglet de la fenêtre

Cette page permet de montrer en détails les caractéristiques de l'incident (utilisateur, type d'incident, photo de l'incident, par qui il a été signalé ainsi que l'adresse de celui-ci).

---
Feel free to make recommendations and put a star on the project's Github.

You can also Buy Me a Coffee here : https://www.buymeacoffee.com/sanglierkev
