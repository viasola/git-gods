const leftBar = document.querySelector('.left-bar')
const rightBar = document.querySelector('.right-bar')

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


axios.get('/api/owners/total').then(res => {
  let allData = res.data
  let total = 0

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

    leftBar.appendChild(title1)
    leftBar.appendChild(subHeader)
    leftBar.appendChild(totalOwners)
    leftBar.appendChild(title2)
    leftBar.appendChild(ownersTable)
    ownersTable.appendChild(column)
    column.appendChild(ownerRow)
    column.appendChild(countRow)
  })
  
})

axios.get('/api/stations/all').then(res => {
  let data = res.data

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

    data.forEach(database => {
      stationName.textContent = data[i].name
      stationAdd.textContent = data[i].street_add
      stationCity.textContent = data[i].city
    })

    nearestSection.appendChild(stationDiv)
    stationDiv.appendChild(stationName)
    stationDiv.appendChild(stationAdd)
    stationDiv.appendChild(stationCity)
  }

})

