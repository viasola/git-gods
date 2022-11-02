

let map;

function initMap() {
  const operaHouse = { lat: -33.856159, lng: 151.215256 }
  map = new google.maps.Map(document.getElementById("map"), {
    // center property tells API where to center the map
    center: operaHouse,
    zoom: 13,
    minZoom: 11,
  });
  
  const marker = new google.maps.Marker({
    position: operaHouse,
    map: map,
  })
}

window.initMap = initMap;

