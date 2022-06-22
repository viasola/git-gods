const leftBar = document.querySelector('.left-bar')
const rightBar = document.querySelector('.right-bar')

let map, infoWindow;

function initMap() {
  // to test set sensor location to anywhere
  // you can manage locations and add Melbourne lat: -37.8183, lng: 144.9671, timezone: Australia/Melbourne, locale: en-GB
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let currentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
        map = new google.maps.Map(document.getElementById("map"), {
          // center property tells API where to center the map
          center: currentLocation,
          zoom: 13,
          minZoom: 11,
        });
  
        const marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
        });
      })
    } 
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
