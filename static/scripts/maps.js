// initialise et ajoute la map
function initMap(){
    // la location
    var long = parseFloat($("#long").val());  
    var lat = parseFloat($("#lat").val());
    if (long && lat){ // si on a pas de latitude et longitude (pas adresse précise) on affiche pas la carte Google Maps
        const markerpos = { lat: lat  , lng: long };
        // la map centrée sur la localisation
        const map = new google.maps.Map(document.getElementById("map"),{
            zoom: 4,
            center: markerpos,
        });
        // le marqueur centré sur la localisation
        const marker = new google.maps.Marker({
            position: markerpos,
            map: map,
        });
    }
    else{
        $("#map").hide();
    }
}
