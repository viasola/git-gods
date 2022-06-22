const leftBar = document.querySelector('.left-bar')
const rightBar = document.querySelector('.right-bar')

let markers = []
let map, infoWindow;

// close your eyes and collapse this function for your sanity
function placeMarker(stationName, stationOwner, currentStationCoord){
  let pinColor
  switch(stationOwner[0]){
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
  let markerImage = {
      path: pinSVGFilled,
      anchor: new google.maps.Point(12,17),
      fillOpacity: 1,
      fillColor: pinColor,
      strokeWeight: 2,
      strokeColor: "white",
      scale: 2,
      labelOrigin: new google.maps.Point(12,10)
  };
  let label = {
      text: pinLabel,
      color: "black",
      fontSize: "13px",
      fontWeight: '900'
  };
  const marker = new google.maps.Marker({
    position: currentStationCoord,
    map: map,
    icon: markerImage,
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

function removeAllMarkers(){
  markers.forEach(marker => {
    marker.setMap(null)
  })
}

function initMap() {
  let currentLocation
  // to test set sensor location to anywhere
  // you can manage locations and add Melbourne lat: -37.8183, lng: 144.9671, timezone: Australia/Melbourne, locale: en-GB
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      map = new google.maps.Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 13,
        minZoom: 11,
      });
      
      let currenLocDiv = document.createElement('div')
      let titleCl = document.createElement('h2')
      let inputLat = document.createElement('input')
      let inputLong = document.createElement('input')
      let labelLat = document.createElement('label')
      let labelLong = document.createElement('label')

      currenLocDiv.className = 'Current-loc'
      titleCl.textContent = 'Current Location'
      labelLat.textContent = 'Latitude'
      labelLong.textContent = 'Longitude'
      inputLat.value = position.coords.latitude
      inputLong.value = position.coords.longitude
      rightBar.appendChild(currenLocDiv)
      currenLocDiv.appendChild(titleCl)
      currenLocDiv.appendChild(labelLat)
      currenLocDiv.appendChild(inputLat)
      currenLocDiv.appendChild(labelLong)
      currenLocDiv.appendChild(inputLong)

      map.addListener("dragend", () => {
        removeAllMarkers()

        axios.get('/api/stations/all').then(res =>{
          res.data.forEach(station => {
            let lat = station.lat
            let long = station.long
            let stationName = station.name
            let stationOwner = station.owner
            let currentStationCoord = { lat: lat, lng: long}
          
            placeMarker(stationName, stationOwner, currentStationCoord)
          })
        })
      })

      map.addListener('zoom_changed', () => {
        removeAllMarkers()

        axios.get('/api/stations/all').then(res =>{
          res.data.forEach(station => {
            let lat = station.lat
            let long = station.long
            let stationName = station.name
            let stationOwner = station.owner
            let currentStationCoord = { lat: lat, lng: long}
            
            placeMarker(stationName, stationOwner, currentStationCoord)
          })
        })
      })
    })
  }
}
  
window.initMap = initMap;

axios.get('/api/stations/all').then(res =>{
  res.data.forEach(station => {
    let lat = station.lat
    let long = station.long
    let stationName = station.name
    let stationOwner = station.owner
    let currentStationCoord = { lat: lat, lng: long}

    placeMarker(stationName, stationOwner, currentStationCoord)
  })
})

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
    let randomData = allData[Math.floor(random(0, 300))]
    
    station.textContent = randomData.name
    owner.textContent = randomData.owner

  }

  spotlightContainerDiv.appendChild(title)
  spotlightContainerDiv.appendChild(station)
  spotlightContainerDiv.appendChild(owner)
  spotlightContainerDiv.appendChild(refreshLink)
  leftBar.appendChild(spotlightContainerDiv)

/////////// Nearest 5 stations section
  let nearestSection = document.createElement('section')
  let nearestTitle = document.createElement('h1')

  nearestSection.className = 'nearest_5'
  nearestTitle.textContent = 'nearest 5'
  
  rightBar.appendChild(nearestSection)
  nearestSection.appendChild(nearestTitle)
  
// loop through 5 stations
  for (let i = 0; i <= 5; i++) {
    let stationDiv = document.createElement('div')
    let stationName = document.createElement('h4')
    let stationAdd = document.createElement('p')
    let stationCity = document.createElement('p')
    
    allData.forEach(database => {
      stationName.textContent = allData[i].name
      stationAdd.textContent = allData[i].street_add
      stationCity.textContent = allData[i].city
    })

    nearestSection.appendChild(stationDiv)
    stationDiv.appendChild(stationName)
    stationDiv.appendChild(stationAdd)
    stationDiv.appendChild(stationCity)
  }
})

