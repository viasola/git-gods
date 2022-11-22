const leftBar = document.querySelector('.left-bar')
const rightBar = document.querySelector('.right-bar')
const spotlightDiv = document.querySelector('.spotlight-div')
const statsDiv = document.querySelector('.stats-div')
const currentDiv = document.querySelector('.current-div')
const nearestDiv = document.querySelector('.nearest-div')
const latInput = document.querySelector('.input-lat')
const lngInput = document.querySelector('.input-lng')
const addressDiv = document.querySelector('.address-div')
const addressDetail = document.querySelector('.address')
const refreshLink = document.querySelector('.refresh-link')
const randomStation = document.querySelector('.station-link')
const spotlightOwner = document.querySelector('.spotlight-owner')
const nearestSection = document.querySelector('.nearest-section')

let allRandomData
let markers = []


let map, infoWindow, currentLocation;

// close your eyes and collapse this function for your sanity
function placeMarker(stationName, stationOwner, currentStationCoord) {
  let pinColor
  switch (stationOwner[0]) {
    case 'C':
      pinColor = '#ff0000';
      break;
    case 'B':
      pinColor = '#90ef90';
      break;
    case 'S':
      pinColor = '#ffff02';
      break;
    case '7':
      pinColor = '#ffa502';
      break;
    default:
      pinColor = '#0084ff';
  }
  let pinLabel = stationOwner[0];
  let pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
  let label = {
    text: pinLabel,
    color: "black",
    fontSize: "13px",
    fontWeight: '900'
  };
  const marker = new google.maps.Marker({
    position: currentStationCoord,
    map: map,
    icon: {
      path: pinSVGFilled,
      anchor: new google.maps.Point(12,17),
      fillOpacity: 1,
      fillColor: pinColor,
      strokeWeight: 2,
      strokeColor: "white",
      scale: 2,
      labelOrigin: new google.maps.Point(12,10)
  },
    label: label
  })

  const contentString = `<h1>${stationName}</h1>` + `<p>${stationOwner}</p>`

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
    markers.push(marker)
  }

function removeOutOfBoundMarkers(){
  for (let idx = markers.length - 1; idx >= 0; idx--){
    if (!map.getBounds().contains(markers[idx].getPosition())){
      markers[idx].setMap(null)
      markers.splice(idx, idx)
      if (markers.length === 1) markers.splice(idx)
    }
  }
}

function handleLink() {
  currentLocation = new google.maps.LatLng(allRandomData.lat, allRandomData.long)

  map.setCenter(currentLocation)
  placeMakers(currentLocation) 
}

function isMarkerOnMap(coord){
  let result = false
  
  markers.forEach(marker => {
    if (coord.equals(marker.getPosition())) result = true
  })
  return result
}

function getNearestStationColor(nearestStation) {
  if (nearestStation.owner.includes('BP')) {
    return 'bp-color'
  } else if (nearestStation.owner.includes('Caltex')){
    return 'caltex-color'
  } else if (nearestStation.owner.includes('7-Eleven')){
    return 'seven-eleven-color'
  } else if (nearestStation.owner.includes('Shell')){
    return 'shell-color'
  } else {
    return 'default-color'
  }
}

function renderNearest(nearestStation) {
  let nearestStationColor = getNearestStationColor(nearestStation)

  return `
  <div class="nearest-station ${nearestStationColor}">
      <h4>${nearestStation.name}</h4>
      <div class="owner-text">${nearestStation.owner}</div>
      <p>${nearestStation.street_add}</p>
      <p>${nearestStation.city}</p>
  </div>
  `
}

function renderNearest5(nearestStations) {
  
  return nearestStations.filter(station => nearestStations.indexOf(station) < 5).map(renderNearest).join('')
}

function updateNearestStations() {
  let centerLat = map.center.lat()
  let centerLong = map.center.lng()

  axios.get(`/api/stations/nearest?lat=${centerLat}&long=${centerLong}&rad=25`).then(res => {
    let nearestStations = res.data

    nearestSection.innerHTML = renderNearest5(nearestStations)
  })
}

function loadNearestStations(currentLocation) {
  let centerLat = currentLocation.lat()
  let centerLong = currentLocation.lng()

  axios.get(`/api/stations/nearest?lat=${centerLat}&long=${centerLong}&rad=25`).then(res => {
    let nearestStations = res.data

    nearestSection.innerHTML = renderNearest5(nearestStations)
  })
}

function isWithinBounds(coord){
  return map.getBounds().contains(coord)
}

function initMap() {
  // you can manage locations and add Melbourne lat: -37.8183, lng: 144.9671, timezone: Australia/Melbourne, locale: en-GB
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     
      
      loadNearestStations(currentLocation)
      
      map = new google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 13,
        minZoom: 11,
        
      });
      getReverseGeocodingData()
      currentLoc()
      placeNearestMarkers(currentLocation)
   
      
      map.addListener("dragend", () => {
        removeOutOfBoundMarkers()
        updateCurrentLoc()
        updateNearestStations()
        getReverseGeocodingData()
        placeMakers()
      })
      
      map.addListener('zoom_changed', () => {
        getReverseGeocodingData()
        removeOutOfBoundMarkers()
        updateCurrentLoc()
        placeMakers()
      })

    })
  }
}

function placeMakers(){
  axios.get(`/api/stations/nearest?lat=${currentLocation.lat()}&long=${currentLocation.lng()}&rad=25`).then(res => {
    res.data.forEach(station => {
      let lat = Number(station.lat.toFixed(5))
      let long = Number(station.long.toFixed(5))
      let stationName = station.name
      let stationOwner = station.owner
      let currentStationCoord = { lat: lat, lng: long}
      let googleCoord = new google.maps.LatLng(currentStationCoord)

      if (isWithinBounds(googleCoord) && !isMarkerOnMap(googleCoord)){
        placeMarker(stationName, stationOwner, currentStationCoord)
    } 
  })
})
}

axios.get('/api/stations/random').then(res => {
  allRandomData = res.data

  randomStation.setAttribute('href', 'javascript:handleLink()')
  refreshLink.setAttribute('href', '/')

  randomStation.textContent = allRandomData.name
  spotlightOwner.textContent = allRandomData.owner

  spotlightDiv.appendChild(randomStation)
  spotlightDiv.appendChild(spotlightOwner)
  spotlightDiv.appendChild(refreshLink)
  leftBar.appendChild(spotlightDiv)

})


axios.get('/api/owners/total').then(res => {
  let allData = res.data
  let total = 0

  
  let title1 = document.createElement('h1')
  let subHeader = document.createElement('h2')
  let title2 = document.createElement('h2')
  let ownersTable = document.createElement('table')
  let totalOwners = document.createElement('div')
  totalOwners.className = 'station-count'

  title1.textContent = 'STATS'
  subHeader.textContent = 'Total Stations'
  title2.textContent = 'Breakdown by Owners'

  allData.forEach(data => {

    let totalCountOfOwners = total += Number(data.count)
    totalOwners.textContent = totalCountOfOwners

    if (data.count > 1) {
      
      let column = document.createElement('tr')
      let ownerRow = document.createElement('td')
      ownerRow.className = 'owner-row'
      let countRow = document.createElement('td')
      countRow.className = 'count-row'
  
      ownerRow.textContent = data.owner
      countRow.textContent = data.count
  
      leftBar.appendChild(statsDiv)
      statsDiv.appendChild(title1)
      statsDiv.appendChild(subHeader)
      statsDiv.appendChild(totalOwners)
      statsDiv.appendChild(title2)
      statsDiv.appendChild(ownersTable)
      ownersTable.appendChild(column)
      column.appendChild(ownerRow)
      column.appendChild(countRow)
    }
  
  })
  
})


// CURRENT LOCATION
  function currentLoc() {

    let addressTitle = document.createElement('h2')
    let addressDetail = document.createElement('p')
    latInput.value = currentLocation.lat()
    lngInput.value = currentLocation.lng()
    
  }
  
  function updateCurrentLoc (){
    let latCenter = map.center.lat()
    let longCenter = map.center.lng()
    latInput.value = latCenter
    lngInput.value = longCenter
  }


  // GEO REVERSE ADDRESS
  function getReverseGeocodingData() {
    var latlng = map.center
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng },  (results, status) =>{
        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            let address = (results[0].formatted_address);
            addressDetail.textContent = address
        }
    });
}



// console.log(getReverseGeocodingData(-37.8183, 144.9671))




axios.get('/api/stations/all').then(res => {
  let allData = res.data

/////////// Nearest 5 stations section
  let nearestSection = document.createElement('section')
  let nearestTitle = document.createElement('h1')

    if (data.count > 1) {
      
      let column = document.createElement('tr')
      let ownerRow = document.createElement('td')
      ownerRow.className = 'owner-row'
      let countRow = document.createElement('td')
      countRow.className = 'count-row'
  
      ownerRow.textContent = data.owner
      countRow.textContent = data.count
  
      leftBar.appendChild(statsDiv)
      statsDiv.appendChild(title1)
      statsDiv.appendChild(subHeader)
      statsDiv.appendChild(totalOwners)
      statsDiv.appendChild(title2)
      statsDiv.appendChild(ownersTable)
      ownersTable.appendChild(column)
      column.appendChild(ownerRow)
      column.appendChild(countRow)
    }
  })



function placeNearestMarkers(currentLocation){
  axios.get(`/api/stations/nearest?lat=${currentLocation.lat()}&long=${currentLocation.lng()}&rad=25`).then(res => {
  res.data.forEach(station => {
    let lat = Number(station.lat.toFixed(5))
    let long = Number(station.long.toFixed(5))
    let stationName = station.name
    let stationOwner = station.owner
    let currentStationCoord = { lat: lat, lng: long}
    let googleCoord = new google.maps.LatLng(currentStationCoord)

    if (isWithinBounds(googleCoord)){
      placeMarker(stationName, stationOwner, currentStationCoord)
    } 
  })
})
}
