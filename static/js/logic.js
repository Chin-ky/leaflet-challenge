// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  let processFeature = (feature, layer) => {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr>
    <h3>Magnitude: ${feature.properties.mag}</h3>
      <hr><p>Time of Occurrence: ${new Date(feature.properties.time)}</p>`);
  };

  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: processFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: function(feature) {
        return {
          color: "white",
          // Call the chooseColor function to decide which color to give each earthquake(color based on magnitude)
          fillColor: chooseColor(feature.properties.mag),
          fillOpacity: 0.5,
          weight: 1.5
        };
      }
  }); 

  createMap(earthquakes);
}
// function chooseColor(magnitude) {
//     switch (maginitude) {
//     case "Brooklyn":
//       return "yellow";
//     case "Bronx":
//       return "red";
//     case "Manhattan":
//       return "orange";
//     case "Queens":
//       return "green";
//     case "Staten Island":
//       return "purple";
//     default:
//       return "black";
//     }
//   }



function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create a new map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


// function countryColor(mag) {
//     let color = 'red';
  
//     if (points > 200) {
//       color = 'yellow';
//     } else if (points > 100) {
//       color = 'blue';
//     } else if (points > 90) {
//       color = 'green';
//     }
  
//     return color;
//   }
  
//   function countryRadius(points) {
//     return points * 1500;
//   }

magnitude = +magnitude

function chooseColor(magnitude) {
    let color = 'yellow';
    if (magnitude > 0.5) {
          color = 'red';
      } else if (magnitude > 1) {
          color = 'orange';
      } else if (magnitude > 1.5) {
          color = 'green';
      } else if (magnitude > 2) {
          color = 'purple'
      } else if (magnitude > 2.5) {
          color = 'black'
      }
      return color;
  
    function earthquakeRadius(mag) {
        return mag * 15000;
      }
    }

