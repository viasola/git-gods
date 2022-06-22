const leftBar = document.querySelector('.left-bar')

let map, infoWindow;

function initMap() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(initialLocation);
    });
}
  // const currentLocation = { lat: -33.856159, lng: 151.215256 }
  map = new google.maps.Map(document.getElementById("map"), {
    // center property tells API where to center the map
    center: currentLocation,
    zoom: 13,
    minZoom: 11,
  });

  const marker = new google.maps.Marker({
    position: currentLocation,
    map: map,
  })

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


window.initMap = initMap;




axios.get('/api/owners/total').then(res => {
  let allData = res.data
  let total = 0

  let statsContainerDiv = document.createElement('div')
  let title1 = document.createElement('h1')
  let subHeader = document.createElement('h2')
  let title2 = document.createElement('h1')
  let ownersTable = document.createElement('table')
  let totalOwners = document.createElement('div')


  title1.textContent = 'stats'
  subHeader.textContent = 'total stations'
  title2.textContent = 'breakdown by owners'

  allData.forEach(data => {

    let totalCountOfOwners = total += Number(data.count)

    let column = document.createElement('tr')
    let ownerRow = document.createElement('td')
    let countRow = document.createElement('td')

    totalOwners.textContent = totalCountOfOwners
    ownerRow.textContent = data.owner
    countRow.textContent = data.count

    leftBar.appendChild(statsContainerDiv)
    statsContainerDiv.appendChild(title1)
    statsContainerDiv.appendChild(subHeader)
    statsContainerDiv.appendChild(totalOwners)
    statsContainerDiv.appendChild(title2)
    statsContainerDiv.appendChild(ownersTable)
    ownersTable.appendChild(column)
    column.appendChild(ownerRow)
    column.appendChild(countRow)
  })

})

axios.get('/api/stations/all').then(res => {
  let allData = res.data

  let spotlightContainerDiv = document.createElement('div')
  let title = document.createElement('h1')
  let refreshLink = document.createElement('a')
  let station = document.createElement('p')
  let owner = document.createElement('p')

  refreshLink.setAttribute('href', '/')

  title.textContent = 'spotlight'
  refreshLink.textContent = 'refresh'
  
  function random(min,max) {
    return Math.random() * (max-min) + min
  }

  for (let i = 0; i < allData.length; i++) {
    let randomData = allData[Math.floor(random(0, 5244))]
    
    station.textContent = randomData.name
    owner.textContent = randomData.owner

  }

  spotlightContainerDiv.appendChild(title)
  spotlightContainerDiv.appendChild(station)
  spotlightContainerDiv.appendChild(owner)
  spotlightContainerDiv.appendChild(refreshLink)
  leftBar.appendChild(spotlightContainerDiv)

})

