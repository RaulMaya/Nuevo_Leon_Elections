// SELECT HTML ELEMENTS
var dropdown = d3.select("#selMunicipio");
var resultsInfo = d3.select("#election-results");



// RENDER DROPDOWN FUNCTION
function renderDrowpdown(municipios, ids) {
    for (var i = 0; i < municipios.length; i++) {
        dropdown.append('option').text(municipios[i]).attr("value", (ids[i]));
    }
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






// LOAD, RENDER & PLOT
// Read JSON dataset using D3 library (samples.json)
d3.json("../../../cleaning/Elecciones_NL/output/id_municipios.json").then((data) => {

    console.log("Municipios:", data);

    var ids = data.map(d => d.ID);
    var municipios = data.map(d => d.Municipio);

    console.log("IDs:", ids);
    console.log("Municipios:", municipios);

    renderDrowpdown(municipios, ids);


    d3.json("../../../cleaning/Elecciones_NL/output/resultados_a2021.json").then((a2021) => {

        console.log("Resultados:", a2021)

        var defaultMunicipio = a2021.find((d) => d.ID === 19021);

        console.log("defaultMunicipio:", defaultMunicipio)

        renderResults(defaultMunicipio);

        var ganadores = ['PAN', 'PRI', 'MC', 'MORENA', 'PANAL', 'PES', 'PRD'];
        var color = ['blue', 'red', 'orange', 'brown', 'pink', 'cyan', 'yellow']
        var x = ganadores.map(d => defaultMunicipio[d] / defaultMunicipio.Total * 100).reverse();
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
                text: "Resultados Electorales",
                font: { size: 20, color: 'black' },
                y: 0.87
            },
            xaxis: {
                title: {
                    text: "Porcentaje Votación",
                    standoff: 15
                }
            }
        };

        Plotly.newPlot('bar', [trace], layout);









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