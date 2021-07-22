// DEFAULT ID
var defaultID = 19001;

// ENDPOINTS
var link_id = "../../../cleaning/output/id_municipios.json";
var link_a2015 = "../../../cleaning/output/resultados_a2015.json";
var link_a2018 = "../../../cleaning/output/resultados_a2018.json";
var link_a2021 = "../../../cleaning/output/resultados_a2021.json";
var link;

// SELECT HTML ELEMENTS
var title = d3.select("#nombre-municipio");
var dropdown = d3.select("#selMunicipio");
var resultsInfo = d3.select("#election-results");

// RENDER DROPDOWN FUNCTION
function renderDrowpdown(municipios, ids) {
    for (var i = 0; i < municipios.length; i++) {
        dropdown.append('option').text(municipios[i]).attr("value", (ids[i]));
    }
}

// RENDER TITLE FUNCTION
function renderTitle(id_municipio) {

    d3.json(link_id).then((id_data) => {
        var rowMunicipio = id_data.find((d) => d.ID === id_municipio);
        title.html("").append('p').text(`Municipio ${rowMunicipio.ID}: ${rowMunicipio.Municipio}`);
    });
}

// RENDER RESULTS FUNCTION
function renderResults(municipio) {
    ganador = municipio.Ganador
    console.log(ganador);
    resultsInfo.html("")
        .append('p').text(`Ganador: ${ganador}`)
        .append('p').text(`Votos: ${municipio[ganador]}`)
        .append('p').text(`${Math.round((municipio[ganador] / municipio.Total * 100), 2)}%`)
    //         .style('font-size', '11.5px')
    //         .style('font-weight', 'bold');
}

// RENDER CHART
// function renderChart(x, y, id, year) {

//     var color = ['blue', 'red', 'orange', 'brown', 'gray'];
//     var trace = { type: 'bar', orientation: 'h', x: x.reverse(), y: y.reverse(),
//         marker: { color: color.reverse() } };
//     var layout = { title: {text: year, font: { size: 20, color: 'black' }, y: 0.87},
//         xaxis: {title: {text: "Votación", standoff: 15} } };

//     Plotly.newPlot(id, [trace], layout);

// }

// RENDER CHART.JS
function renderChartJS(x, y, year) {

    var color = ['blue', 'red', 'orange', 'brown', 'gray'];

    var chart2015 = document.getElementById("chart-2015").getContext('2d');
    var chart2018 = document.getElementById("chart-2018").getContext('2d');
    var chart2021 = document.getElementById("chart-2021").getContext('2d');

    if (year === 2015) { myChart = chart2015; }
    else if (year === 2018) { myChart = chart2018; }
    else if (year === 2021) { myChart = chart2021; }
    
    let hBar = new Chart(myChart, {
            type:'bar',
            data:{
                labels: y,
                datasets: [{
                    label: year,
                    data: x,
                    backgroundColor: color
                }],
            },
            options:{indexAxis: 'y'}
        });
}

// RENDER YEAR
function renderYear(id_municipio, year) {

    if (year === 2015) { link = link_a2015; text = "2015"; id = "chart-2015" }
    else if (year === 2018) { link = link_a2018; text = "2018"; id = "chart-2018" }
    else if (year === 2021) { link = link_a2021; text = "2021"; id = "chart-2021" }

    d3.json(link).then((year_data) => {

        var rowMunicipio = year_data.find((d) => d.ID === id_municipio);
        var partidos = ['PAN', 'PRI', 'MC', 'MORENA', 'Otro'];
        var x = partidos.map(d => rowMunicipio[d]);
        var y = partidos.map(d => `${d} `);

        // renderChart(x, y, text, id)

        renderChartJS(x, y, year)

        console.log("Municipio:", rowMunicipio.Municipio);
        console.log("Año:", year);
        console.log("X:", x);
        console.log("Y:", y);

    });
}



// RUN FUNCTION
function runEvent(id_municipio) {

    // DROPDOWN (delete)
    d3.json(link_id).then((id_data) => {
        console.log("Municipios:", id_data);
        var ids = id_data.map(d => d.ID);
        var municipios = id_data.map(d => d.Municipio);
        console.log("IDs:", ids);
        console.log("Municipios:", municipios);
        renderDrowpdown(municipios, ids);
    });

    renderTitle(id_municipio);
    renderYear(id_municipio, 2015);
    renderYear(id_municipio, 2018);
    renderYear(id_municipio, 2021);


}


// INIT
runEvent(defaultID)





/*

// LOAD, RENDER & PLOT
// Read JSON dataset using D3 library (samples.json)



d3.json("../../../cleaning/output/resultados_a2021.json").then((a2021) => {

    console.log("Resultados:", a2021)

    var defaultMunicipio = a2021.find((d) => d.ID === defaultID);
    console.log("defaultMunicipio:", defaultMunicipio)

    renderTitle(defaultMunicipio);



    renderResults(defaultMunicipio);

    var ganadores = ['PAN', 'PRI', 'MC', 'MORENA', 'Otro'];
    var color = ['blue', 'red', 'orange', 'brown', 'gray'];
    var x = ganadores.map(d => defaultMunicipio[d]).reverse();
    var y = ganadores.map(d => `${d} `).reverse();

    // HORIZONTAL BAR CHART
    var trace = {
        type: 'bar',
        orientation: 'h',
        x: x,
        y: y,
        // text: otu_labels.slice(0, 10)
        marker: {
            color: color.reverse()
        }
    };

    var layout = {
        title: {
            text: "2015",
            font: { size: 20, color: 'black' },
            y: 0.87
        },
        xaxis: {
            title: {
                text: "Votación",
                standoff: 15
            }
        }
    };

    Plotly.newPlot('chart-2015', [trace], layout);









})
















}); /*


    // Assign data to variables
    var names = data.names.map((row) => parseInt(row));
    var metadata = data.metadata;
    var samples = data.samples;

    // Render dropdown (sample names)
    renderDrowpdown(names);

    // SET DEFAULT VALUE
    // Default value for initial dashboard metadata & plots
    var defaultName = 940;

    // Get sample metadata
    var defaultMetadata = metadata.find((metadata) => metadata.id === defaultName);

    // Render sample metadata
    renderMetadata(defaultMetadata);

    // Get sample data
    var defaultSample = samples.find((sample) => parseInt(sample.id) === defaultName);

    // SORT SAMPLE DATA
    // Set initial values
    var sampleArr = [];
    var sampleDict = {};

    // Build data collection
    for (var i = 0; i < defaultSample.sample_values.length; i++) {
        sampleDict["id"] = defaultName;
        sampleDict["sample_value"] = defaultSample.sample_values[i];
        sampleDict["otu_id"] = String(defaultSample.otu_ids[i]);
        sampleDict["otu_label"] = defaultSample.otu_labels[i];
        sampleArr.push(sampleDict);
        sampleDict = {};
    }

    // Sort data collection
    var sortedArr = sampleArr.sort(sortDesc);

    // Build sorted data arrays
    var sample_values = sortedArr.map((row) => row.sample_value);
    var otu_ids = sortedArr.map((row) => row.otu_id);
    var otu_labels = sortedArr.map((row) => row.otu_label);


    // HORIZONTAL BAR CHART
    var trace = {
        type: 'bar',
        orientation: 'h',
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map((row) => `OTU ${String(row)} `).reverse(),
        text: otu_labels.slice(0, 10)
    };

    var layout = {
        title: {
            text: "Top 10 Bacteria Cultures Found",
            font: { size: 20, color: 'black' },
            y: 0.87
        },
        xaxis: {
            title: {
                text: "Sample Values",
                standoff: 15
            }
        }
    };

    Plotly.newPlot('bar', [trace], layout);

})


// RENDER DROPDOWN FUNCTION
function renderDrowpdown(names) {
    names.forEach((name) => {
        dropdown.append('option').text(name);
    });
}


// RENDER METADATA FUNCTION
function renderMetadata(sampleMetadata) {
    demographicInfo.html("");
    for (const [key, value] of Object.entries(sampleMetadata)) {
        demographicInfo.append('p').text(`${key.toUpperCase()}: ${value}`)
            .style('font-size', '11.5px')
            .style('font-weight', 'bold');
    }
}


// SORT SAMPLE DATA FUNCTIONS (by sample_value)
// Ascending
function sortDesc(a, b) { return b.sample_value - a.sample_value; }
// Descending
function sortAsc(a, b) { return a.sample_value - b.sample_value; }



// CHANGE OPTION FUNCTION
function optionChanged() {

    // Get input values (from elements)
    var name = parseInt(dropdown.property('value'));

    // LOAD, RENDER & RESTYLE
    d3.json("data/samples.json").then((data) => {

        // Assign data to variables
        var metadata = data.metadata;
        var samples = data.samples;

        // Get selected sample metadata
        var selectedMetadata = metadata.find((metadata) => metadata.id === name);

        // Render metadata
        renderMetadata(selectedMetadata);

        // Get sample data
        var selectedSample = samples.find((sample) => parseInt(sample.id) === name);

        // SORT SAMPLE DATA
        // Set initial values
        var sampleArr = [];
        var sampleDict = {};

        // Build data collection
        for (var i = 0; i < selectedSample.sample_values.length; i++) {
            sampleDict["id"] = name;
            sampleDict["sample_value"] = selectedSample.sample_values[i];
            sampleDict["otu_id"] = String(selectedSample.otu_ids[i]);
            sampleDict["otu_label"] = selectedSample.otu_labels[i];
            sampleArr.push(sampleDict);
            sampleDict = {};
        }

        // Sort data collection
        var sortedArr = sampleArr.sort(sortDesc);

        // Build sorted data arrays
        var sample_values = sortedArr.map((row) => row.sample_value);
        var otu_ids = sortedArr.map((row) => row.otu_id);
        var otu_labels = sortedArr.map((row) => row.otu_label);


        // RESTYLE BAR CHART
        var x = sample_values.slice(0, 10).reverse();
        var y = otu_ids.slice(0, 10).map((row) => `OTU ${String(row)} `).reverse();
        var text = otu_labels.slice(0, 10);

        Plotly.restyle('bar', 'x', [x]);
        Plotly.restyle('bar', 'y', [y]);
        Plotly.restyle('bar', 'text', [text]);


        // RESTYLE BUBBLE CHART
        var x = otu_ids;
        var y = sample_values;
        var markerSize = sample_values;
        var markerColor = otu_ids;

        Plotly.restyle('bubble', 'x', [x]);
        Plotly.restyle('bubble', 'y', [y]);
        Plotly.restyle('bubble', 'marker.size', [markerSize]);
        Plotly.restyle('bubble', 'marker.color', [markerColor]);

        // RESTYLE GAUGE CHART
        var value = selectedMetadata.wfreq;

        Plotly.restyle('gauge', 'value', value);
        Plotly.restyle('gauge', 'gauge.threshold.value', value);

    });
}

console.log("Script successfully read");   // DEBUG

*/