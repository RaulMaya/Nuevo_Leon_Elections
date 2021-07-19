function getColor(d) {
  return d > 0.41  ? '#800026' :
         d > 0.39  ? '#BD0026' :
         d > 0.37  ? '#E31A1C' :
         d > 0.35 ? '#FC4E2A' :
         d > 0.33 ? '#FD8D3C' :
         d > -1  ? '#FED976' :
                    '#FFEDA0';
}

var nlMunicipality = "static/data/nyu_geojson.json"

var ginis = "static/data/dataframe_merged_apis.js"

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
  });

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v10",
  accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
      });

      var baseMaps = {
        "Satellite": satellitemap,
        "Outdoor": outdoormap,
        "Light": lightmap,
        "Dark": darkmap
    };

  var myMap = L.map("map",{
    center: [25.02, -100.52],
    zoom: 7,
    layers: [darkmap]
  });
  
  L.control.layers(baseMaps).addTo(myMap);

d3.json(nlMunicipality).then(function(data){
  console.log(data.features)

  d3.json(ginis).then(function(feature){
    var gini_object = feature.GINI
    console.log(gini_object.length)

    gini_list = []

    for (let i = 0; i < 51; i++) {
      var g  = gini_object[i];
      gini_list.push(g)
    };

    console.log(gini_list)


  L.geoJson(data,{
    style: function(feature){
      return{
        color: "red",
        fillColor: getColor(gini_list)
      }
    }
  }).addTo(myMap);
});
});

