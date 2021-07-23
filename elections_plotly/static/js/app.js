// DEFAULT ID
var defaultID = 19001;

// ENDPOINTS
var link;
var link_id = "../../../cleaning/output/id_municipios.json";
var link_a2015 = "../../../cleaning/output/resultados_a2015.json";
var link_a2018 = "../../../cleaning/output/resultados_a2018.json";
var link_a2021 = "../../../cleaning/output/resultados_a2021.json";

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

// RENDER CHART.JS FUNCTION
function renderChartJS(x, y, year) {

    // Pending: choose pretty colors & alpha
    var color = ['blue', 'red', 'orange', 'brown', 'gray'];

    var chart2015 = document.getElementById("chart-2015").getContext('2d');
    var chart2018 = document.getElementById("chart-2018").getContext('2d');
    var chart2021 = document.getElementById("chart-2021").getContext('2d');

    // Pending: Set animation parameters
    params = {
        type: 'bar',
        data: {
            labels: y,
            datasets: [{
                data: x,
                backgroundColor: color
            }],
        },
        options: {
            indexAxis: 'y',
            plugins: {
                title: { display: true, text: year, font: { size: 25 } },
                legend: { display: false }
            }
        }
    }

    if (year === 2015) { results2015 = new Chart(chart2015, params); }
    else if (year === 2018) { results2018 = new Chart(chart2018, params); }
    else if (year === 2021) { results2021 = new Chart(chart2021, params); }

}


// RENDER BAR.JS FUNCTION
function renderBarJS(partMunicipio, partNL, year) {

    var bar2015 = document.getElementById("bar-2015").getContext('2d');
    var bar2018 = document.getElementById("bar-2018").getContext('2d');
    var bar2021 = document.getElementById("bar-2021").getContext('2d');

    if (year === 2015) { text = "% Participación Municipio" }
    else if (year === 2018) { text = ""  }
    else if (year === 2021) { text = " | Participación Nuevo León"  }

    // Pending: Set animation parameters
    // Pending: bar title % / / *Participación
    // Pending: nombreMunicipio en Tarjeta

    params = {
        data: {
            labels: ['', '%', ''],
            datasets: [{
                type: 'bar',
                data: [0, partMunicipio, 0],
                backgroundColor: "yellow",
                barThickness: 15,
                order: 1,
            }, {
                type: 'line',
                data: [partNL, partNL, partNL],
                borderColor: "black",
                pointRadius: 0,
                order: 0,
            }],
        },
        options: {
            indexAxis: 'y',
            plugins: {
                title: { display: true, text: text, font: { size: 15 } },
                legend: { display: false }
            },
            scales: { x: { min: 0, max: 100 } },
            layout: { padding: { left: 55 } },
            animation: false
        }
    }

    if (year === 2015) { part2015 = new Chart(bar2015, params); }
    else if (year === 2018) { part2018 = new Chart(bar2018, params); }
    else if (year === 2021) { part2021 = new Chart(bar2021, params); }

}


// RUN YEAR FUNCTION
function runYear(id_municipio, year) {

    if (year === 2015) { link = link_a2015; }
    else if (year === 2018) { link = link_a2018; }
    else if (year === 2021) { link = link_a2021; }

    d3.json(link).then((year_data) => {

        var rowMunicipio = year_data.find((d) => d.ID === id_municipio);
        var partidos = ['PAN', 'PRI', 'MC', 'MORENA', 'Otro'];
        var x = partidos.map(d => rowMunicipio[d]);
        var y = partidos.map(d => `${d} `);

        renderChartJS(x, y, year)

        var totalVotos = year_data.map(d => d.Total);
        var listaNominal = year_data.map(d => d.LNominal);
        var partNL = math.add(...totalVotos) / math.add(...listaNominal) * 100
        var partMunicipio = rowMunicipio.Total / rowMunicipio.LNominal * 100;

        renderBarJS(partMunicipio, partNL, year);

        console.log("Participación:", partNL, partMunicipio);

        // console.log("Municipio:", rowMunicipio.Municipio);
        // console.log("Año:", year);
        // console.log("X:", x);
        // console.log("Y:", y);

    });
}

// RUN ENTER FUNCTION
function runEnter(id_municipio) {

    // DROPDOWN
    // Pending: Delete HTML Element
    d3.json(link_id).then((id_data) => {
        console.log("Municipios:", id_data);
        var ids = id_data.map(d => d.ID);
        var municipios = id_data.map(d => d.Municipio);
        console.log("IDs:", ids);
        console.log("Municipios:", municipios);
        renderDrowpdown(municipios, ids);
    });

    renderTitle(id_municipio);
    runYear(id_municipio, 2015);
    runYear(id_municipio, 2018);
    runYear(id_municipio, 2021);

}

// INIT
runEnter(defaultID);

// CHANGE OPTION FUNCTION
function optionChanged() {
    var selectedID = parseInt(dropdown.property('value'));
    console.log("Selected:", selectedID);

    results2015.destroy();
    results2018.destroy();
    results2021.destroy();

    part2015.destroy();
    part2018.destroy();
    part2021.destroy();

    runEnter(selectedID);

}

// Pending: Delete debug MSGs

