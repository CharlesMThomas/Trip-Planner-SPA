const mapboxgl = require("mapbox-gl");
const buildMarker = require("./marker.js");
let attractions_data;

mapboxgl.accessToken = "pk.eyJ1IjoiZWxhbmFtaWciLCJhIjoiY2phOXQxenJoMGFzcTMzcXAxcDNld3lpeiJ9.68A3hhLR8qbxv5rf4ai1zw";

const fullstackCoords = [-74.009, 40.705] // NY
// const fullstackCoords = [-87.6320523, 41.8881084] // CHI

const map = new mapboxgl.Map({
  container: "map",
  center: fullstackCoords, // FullStack coordinates
  zoom: 12, // starting zoom
  style: "mapbox://styles/mapbox/streets-v10" // mapbox has lots of different map styles available.
});

const marker = buildMarker("activities", fullstackCoords);
marker.addTo(map);

fetch('/api/')
  .then(res => res.json())
  .then(attractions => {
    attractions_data = attractions;
    attractions.forEach((attraction, idx) => {
      let parent;
      switch(idx) {
        case 0:
          parent = document.getElementById('hotels-choices');
          console.log(parent);
          break;
        case 1:
          parent = document.getElementById('restaurants-choices');
          break;
        case 2:
          parent = document.getElementById('activities-choices');
      }

      attraction.forEach(data => {
        let x = document.createElement("option");
        x.value = data.id;
        x.innerHTML = data.name;
        parent.appendChild(x);
      })
    });
  })
  .catch(err => console.error(err));

  let buttons = document.querySelectorAll('button')

  buttons.forEach(button => {
    button.addEventListener('click', (e) => {

      if (e.target.id === 'hotels-add') {
        let select = document.getElementById('hotels-choices')
        let index = select.selectedIndex;
        let id = select[index].value;
        let name = select[index].text;
      }

    });
  });
