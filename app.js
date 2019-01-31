var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson"

d3.json(URL, function(data) {
    console.log(data.features);
    buildMap(data.features)
});

function buildMap(earthquakes) {

    var pointLayer = L.geoJson(earthquakes, {
        pointToLayer: function(feature, latlng) {
            var color = "";
            if (feature.properties.mag <= 1) {
                color = "#b7f34d";
            }
            else if (feature.properties.mag <=2) {
                color = "#e1f34d";
            }
            else if (feature.properties.mag <=3) {
                color = "#f3db4d";
            }
            else if (feature.properties.mag <=4) {
                color = "#f0a76b";
            }
            else {
                color = "#f06b6b";
            } 
            return new L.CircleMarker(latlng, {
                fillOpacity: 0.9, 
                color: "black",
                weight: 1, 
                fillColor: color, 
                radius: feature.properties.mag * 8
            })}, 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + 
            "</h3><hr><p><strong>Magnitude:</strong> " + feature.properties.mag + "</p>");
        }
    });

    createMap(pointLayer);
}

function createMap(pointLayer) {
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var baseMaps = {
      "Street Map": streetmap
  };

  var overlayMaps = {
      Earthquakes: pointLayer
  };

  var myMap = L.map("map", {
      center: [36.165681, -115.145691],
      zoom: 5, 
      layers: [streetmap, pointLayer]
  });

  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

  // Legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function(myMap) {
      var div = L.DomUtil.create("div", "info legend"), 
      grades = [1, 2, 3, 4, 5],
      labels = [];

      div.innerHTML = 
        '<i style="background:#b7f34d"></i>0 - 1<br><i style="background:#e1f34d"></i>2 - 3<br><i style="background:#f3db4d"></i>3 - 4<br><i style="background:#f0a76b"></i>4 - 5<br><i style="background:#f06b6b"></i>5+<br>'
        

    return div;
        
    };

  legend.addTo(myMap);
}

