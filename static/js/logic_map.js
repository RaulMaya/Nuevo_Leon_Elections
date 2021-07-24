// Pending: colorscale red -> green
function getColor(d) {
  return d > 0.41 ? '#ff0000' :
    d > 0.39 ? '#ff0000' :
      d > 0.37 ? '#ffc100' :
        d > 0.35 ? '#ffff00' :
          d > 0.33 ? '#d6ff00' :
            d > 0.31 ? '#63ff00' :
            '#4fcc00';
}


var iter = "../../A_ETL_Process/output/iter_1920r.js"
var nlMunicipality = "../../D_Maps/static/data/nyu_geojson.json"
var ginis = "../../A_ETL_Process/output/dataframe_merged_apisr.js"
var samuel = "../../A_ETL_Process/output/resultados_g2021.json"
var bronco = "../../A_ETL_Process/output/resultados_g2015.json"
var coordinates = "../../A_ETL_Process/output/coordinatesr.js"

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

var layers = {
  gano_bronco: new L.LayerGroup(),
  perdio_bronco: new L.LayerGroup(),
  gano_samuel: new L.LayerGroup(),
  perdio_samuel: new L.LayerGroup(),
};

var baseMaps = {
  // "Satellite": satellitemap,
  // "Outdoor": outdoormap,
  "Map": lightmap,
  // "Dark": darkmap
};

var myMap = L.map("map", {
  center: [25.54, -99.93],
  zoom: 7,
  layers: [lightmap]
});

var overlays = {
  "Gano Partido Independiente": layers.gano_bronco,
  // "Perdio Partido Independiente": layers.perdio_bronco,
  "Gano Partido Movimiento Ciudadano": layers.gano_samuel,
  // "Perdio Partido Movimiento Ciudadano": layers.perdio_samuel
};

L.control.layers(baseMaps, overlays).addTo(myMap);

var icons = {
  gano_bronco: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  }),
  perdio_bronco: L.ExtraMarkers.icon({
    icon: "ion-chevron-right",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  }),
  gano_samuel: L.ExtraMarkers.icon({
    icon: "ion-chevron-right",
    iconColor: "white",
    markerColor: "blue",
    shape: "circle"
  }),
  perdio_samuel: L.ExtraMarkers.icon({
    icon: "ion-chevron-right",
    iconColor: "white",
    markerColor: "orange",
    shape: "circle"
  }),
};

var lat = []
var lon = []

d3.json(coordinates).then(function (info) {
  console.log(info)
  var lat = []
  var lon = []

  for (let i = 0; i < info.length; i++) {
    var location = info[i];

    lat.push(location.LATITUD)
    lon.push(location.LONGITUD)

  };
  console.log(lat)
  console.log(lon)

  d3.json(bronco).then(function (broncoData) {


    for (let i = 0; i < broncoData.length; i++) {
      broncoData[i].Latitud = lat[i]
      broncoData[i].Longitud = lon[i]
    };
    console.log(broncoData)


    d3.json(samuel).then(function (samuelData) {

      for (let i = 0; i < samuelData.length; i++) {
        samuelData[i].Latitud = lat[i]
        samuelData[i].Longitud = lon[i]
      };
      console.log(samuelData)

      var statusCounter = {
        gano_bronco: 0,
        perdio_bronco: 0,
        gano_samuel: 0,
        perdio_samuel: 0,
      };

      var samuelStatus;

      for (var i = 0; i < samuelData.length; i++) {
        var municipioS = samuelData[i].Ganador

        if (municipioS === "MC") {
          samuelStatus = "gano_samuel"
        }

        else {
          samuelStatus = "perdio_samuel"
        }

        statusCounter[samuelStatus]++;

        var newMarker = L.marker([samuelData[i].Latitud, samuelData[i].Longitud+0.025], {
          icon: icons[samuelStatus]
        });

        newMarker.addTo(layers[samuelStatus]);
        newMarker.bindPopup(samuelData[i].Municipio);
      };


      var broncoStatus;

      for (var i = 0; i < broncoData.length; i++) {
        var municipioB = broncoData[i].Ganador

        if (municipioB === "IND") {
          broncoStatus = "gano_bronco"
        }

        else {
          broncoStatus = "perdio_bronco"
        }

        statusCounter[broncoStatus]++;

        var newMarker = L.marker([broncoData[i].Latitud, broncoData[i].Longitud], {
          icon: icons[broncoStatus]
        });

        newMarker.addTo(layers[broncoStatus]);
        newMarker.bindPopup(broncoData[i].Municipio);
      };

    });
  });
});

d3.json(nlMunicipality).then(function (data) {
  var json_data = data
  console.log(data.features.length);
  console.log();
  console.log(data);

  d3.json(ginis).then(function (feature) {
    var gini_object = feature
    console.log(gini_object)

    d3.json(iter).then(function (iData) {
      console.log(iData)

      population = []
      scholarship = []
      eco_act = []
      unemployed = []
      lack_health_service = []

      for (let i = 0; i < iData.length; i++) {
        var iterData = iData[i];

        population.push(iterData.POBTOT)
        scholarship.push(iterData.GRAPROES)
        eco_act.push(iterData.PEA)
        unemployed.push(iterData.PDESOCUP)
        lack_health_service.push(iterData.PSINDER)
      };

      console.log(population)

      gini_list = []

      for (let i = 0; i < data.features.length; i++) {
        var g = gini_object[i].GINI;
        gini_list.push(g)
      };
      console.log(gini_list)


      for (let i = 0; i < data.features.length; i++) {
        var num_id = json_data.features[i].properties.cve_mun
        var num = parseInt(num_id - 1, 10)
        json_data.features[i].Gini = gini_list[num]
        json_data.features[i].Population = population[num]
        json_data.features[i].Scholarship = scholarship[num]
        json_data.features[i].EconomicallyActive = eco_act[num]
        json_data.features[i].Unemployment = unemployed[num]
        json_data.features[i].LackOfHS = lack_health_service[num]
      };
      console.log(json_data)


      L.geoJson(json_data, {
        style: function (feature) {
          return {
            color: "black",
            fillColor: getColor(feature.Gini),
            fillOpacity: 0.5,
            weight: .5
          };
        },

        onEachFeature: function (feature, layer) {

          var demographicInfo = d3.select("#election-results");
          demographicInfo.html("");

          layer.on({
            mouseover: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            mouseout: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },
            click: mapChange
          });
        }
      }).addTo(myMap);

      var legend = L.control({ position: 'bottomright' });
      legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
          grades = [0.31, 0.33, 0.35, 0.37, 0.39, 0.41],
          labels = ['<b>Gini</b>'],
          from, to;

        for (var i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];

          labels.push(
            '<i style="background:' + getColor(from) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };

      legend.addTo(myMap);

    });
  });
});

