function getColor(d) {
  return d > 0.41  ? '#800026' :
         d > 0.39  ? '#BD0026' :
         d > 0.37  ? '#E31A1C' :
         d > 0.35 ? '#FC4E2A' :
         d > 0.33 ? '#FD8D3C' :
         d > 0.31  ? '#FED976' :
                    '#FFEDA0';
}

var iter = "static/data/iter_1920r.js"

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
    center: [25.54, -99.93],
    zoom: 7,
    layers: [darkmap]
  });
  
  L.control.layers(baseMaps).addTo(myMap);

d3.json(nlMunicipality).then(function(data){
  var json_data =  data
  console.log(data.features.length);
  console.log();
  console.log(data);

  d3.json(ginis).then(function(feature){
    var gini_object = feature.GINI
    console.log(gini_object)

    d3.json(iter).then(function(iData){
      console.log(iData)

      population = []
      scholarship = []
      eco_act = []
      unemployed = []
      lack_health_service = []
    
      for (let i = 0; i < iData.length; i++) {
        var iterData  = iData[i];
        
        population.push(iterData.POBTOT)
        scholarship.push(iterData.GRAPROES)
        eco_act.push(iterData.PEA)
        unemployed.push(iterData.PDESOCUP)
        lack_health_service.push(iterData.PSINDER)
      };
    
      console.log(population)

    gini_list = []

    for (let i = 0; i < data.features.length; i++) {
      var g  = gini_object[i];
      gini_list.push(g)
    };
    console.log(gini_list)


    for (let i = 0; i < data.features.length; i++) {
      var num_id = json_data.features[i].properties.cve_mun
      var num = parseInt(num_id-1 , 10)
      json_data.features[i].Gini = gini_list[num]
      json_data.features[i].Population = population[num]
      json_data.features[i].Scholarship = scholarship[num]
      json_data.features[i].EconomicallyActive = eco_act[num]
      json_data.features[i].Unemployment = unemployed[num]
      json_data.features[i].LackOfHS = lack_health_service[num]
    };
console.log(json_data)


  L.geoJson(json_data,{
    style: function(feature){
      return{
        color: "red",
        fillColor: getColor(feature.Gini),
        fillOpacity: 0.5,
        weight: 1
      };
    },

    onEachFeature: function(feature, layer) {

      var demographicInfo = d3.select("#sample-metadata");
      demographicInfo.html("");

      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        click: function(event) {
          myMap.fitBounds(event.target.getBounds())
          demographicInfo.html("");
          demographicInfo.append("p").text(`Municipio: ${feature.properties.nomgeo}`);
          demographicInfo.append("p").text(`Gini: ${feature.Gini}`);
          demographicInfo.append("p").text(`Población Total: ${feature.Population}`);
          demographicInfo.append("p").text(`Grado Promedio de Escolaridad: ${feature.Scholarship}`);
          demographicInfo.append("p").text(`Población Economicamente Activa: ${feature.EconomicallyActive}`);
          demographicInfo.append("p").text(`Población Desocupada: ${feature.Unemployment}`);
          demographicInfo.append("p").text(`Población sin Afiliación a Servicios de Salud: ${feature.LackOfHS}`);
        }

      });
      layer.bindPopup(`<p><b><u>${feature.properties.nomgeo}</b></u></p><hr>
      <h2><b><u>Gini:</u></b> ${feature.Gini}</h2><br>
      <h2><b><u>ID de Municipio:</u></b> ${feature.properties.cve_mun}</h2><br>
      <h2><b><u>Estado:</u></b> Nuevo León</h2>`);

      
    
        }
  }).addTo(myMap);

  var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0.31, 0.33, 0.35, 0.37, 0.39, 0.41],
            labels = ['<b>Ginis</b>'],
            from, to;

            for (var i = 0; i < grades.length; i++) {
                from = grades [i];
                to = grades[i+1];
        
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

