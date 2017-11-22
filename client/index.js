const mapboxgl = require("mapbox-gl");
const buildMarker = require("./marker.js");
const attractions_data = {
  selectedAttractions: {
    hotels: [],
    restaurants: [],
    activities: []
  }
};

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
    attractions_data.attractions = attractions;
    console.log(attractions[2]);
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
      addAttraction (id, name, attraction_action[0]);
    });
  });

  function addAttraction (id, name, type) {
    console.log(attractions_data.selectedAttractions);
    if (!attractions_data.selectedAttractions[type].includes(name))
      if (type !== 'hotels' || attractions_data.selectedAttractions[type].length < 1)
      //1.  Add to the itinerary panel
      addType(name, type, addMarker(id, type));
  }

  function addType( name, type, marker){
    attractions_data.selectedAttractions[type].push(name);
    let newLi = document.createElement('li');
    let parentUl = document.getElementById(`${type}-list`);
    let remButton = document.createElement('button');
    remButton.classList.add('itinerary-btn');
    remButton.innerHTML='x';
    remButton.addEventListener('click', (e) => {
      e.target.parentNode.remove();
      marker.remove();
      map.flyTo({center: fullstackCoords, zoom: 12});
      attractions_data.selectedAttractions[type] = attractions_data.selectedAttractions[type].filter(attraction => {
        return attraction !== name;
      });
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
        attractionArr = attractions_data.attractions [0];
        break;
      case 'restaurants':
        attractionArr = attractions_data.attractions [1];
        break;
      case 'activities':
        attractionArr = attractions_data.attractions [2];
    }

    let attraction = attractionArr[id -1];
    let coordinates = attraction.place.location;

    let marker = buildMarker(type, coordinates);
    marker.addTo(map);
    let description = getDescription(attraction, type);
    console.log('Marker', marker);
    marker.setPopup(new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description))

    map.flyTo({center: coordinates, zoom: 15});
    return marker;
  }

  function getDescription (attraction, type) {
    let description = {};
    console.log(type);

    switch(type) {
      case 'hotels':
        description.amenities = attraction.amenities;
        description.num_stars = attraction.num_stars;
        break;
      case 'restaurants':
        description.price = attraction.price;
        description.cuisine = attraction.cuisine;
        break;
      case 'activities':
        console.log('Keys', Object.keys(attraction));
        description.age_range = attraction.age_range;
    }

    let html = `<strong>${attraction.name}</strong><br>`;
    html += Object.keys(description).map(key => {
      return key + ": " + description[key]
    }).join('<br>');
    console.log(html);

    return html;
  }

