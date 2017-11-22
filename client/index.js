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
    console.log(attractions_data[0])
    attractions.forEach((attraction, idx) => {
      let parent;
      switch(idx) {
        case 0:
          parent = document.getElementById('hotels-choices');
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
      let attraction_action = e.target.id.split('-');
      let select = document.getElementById(`${attraction_action[0]}-choices`);
      let id = select.value;
      let name = select[select.selectedIndex].text;
      console.log(select, id, name);
      addAttraction (id, name, attraction_action[0]);
    });
  });

  function addAttraction (id, name, type) {
    //2.  Add the marker
    let marker = addMarker(id, type);

    //1.  Add to the itinerary panel
    addType(name, type, marker);
  }

  function addType( name, type, marker){
    console.log(marker);

    console.log(map);
    let newLi = document.createElement('li');
    let parentUl = document.getElementById(`${type}-list`);
    let remButton = document.createElement('button');
    remButton.classList.add('itinerary-btn');
    remButton.innerHTML='x';
    remButton.addEventListener('click', (e) => {
      e.target.parentNode.remove();
      marker.remove();
    });
    newLi.appendChild(remButton);  
    let text = document.createTextNode(name);
    newLi.appendChild(text);
    parentUl.appendChild(newLi);
  }

  function addMarker (id, type) {
    let attractionArr;
    switch (type) {
      case 'hotels':
        attractionArr = attractions_data [0];
        break;
      case 'restaurants': 
        attractionArr = attractions_data [1];
        break;
      case 'activities': 
        attractionArr = attractions_data [1];
    }

    let marker = buildMarker(type, attractionArr[id-1].place.location);
    marker.addTo(map);
    return marker;
  }

  