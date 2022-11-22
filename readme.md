# findr

## Description

---

A Melbourne-based app that assists in searching for the nearest petrol stations around you.

Built with NodeJS, ExpressJS, PostgreSQL and Google Maps API

## Demo

---

![findr](./assets/images/findr%20demo.gif)

## Features

---

- Markers: Colour-coordinated based on station owner, clicking on it will show the station location.
- Spotlight - Highlights a random petrol station, clicking on the name will bring you to the specific station on map.
- Stats - Shows total stations and is breakdowned by Owners.
- Current Location - Based on center of the map, it shows the current address, latitude and longitude.
- Nearest 5 stations: Shows 5 nearest petrol stations according to your Current Location.

## Usage

---

Click and drag to find the nearest petrol stations

1. Get a Google API Key at https://console.cloud.google.com/apis/credentials

2. Clone the repo

```
git clone https://github.com/viasola/git-gods-findr.git
```

3. Install dependencies

```
npm install
npm install express
```

4. Enter your API key in index.html

```html
<script
  src="https://maps.googleapis.com/maps/api/js?key=REPLACE-THIS-WITH-API-KEY&callback=initMap&v=weekly"
  defer
></script>
```

## Contributions

---

Thank you to all that helped with the code.

Aiching
Edmund
Ken
Nuraiman
