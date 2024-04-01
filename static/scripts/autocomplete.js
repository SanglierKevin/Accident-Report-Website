var searchInput = 'search_input';

function loadmap(){
    /**
     * fonction permettant d'utiliser l'autocomplétion d'adresse de google Maps sur la page claim_report.html
     */
    var autocomplete;
    autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {
        types: ['geocode'],
    });
	
    google.maps.event.addListener(autocomplete, 'place_changed', function (){
        var near_place = autocomplete.getPlace();
        document.getElementById('loc_lat').value = near_place.geometry.location.lat();
        document.getElementById('loc_long').value = near_place.geometry.location.lng();
    });

$(document).on('change', '#'+searchInput, function () {
document.getElementById('loc_lat').value = '';

document.getElementById('loc_long').value = '';
});
};
