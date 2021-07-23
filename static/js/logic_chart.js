// DEFAULT ID
var defaultID = 19001;

// ENDPOINTS
var link_id = "../../A_ETL_Process/output/id_municipios.json";
var link_a2015 = "../../A_ETL_Process/output/resultados_a2015.json";
var link_a2018 = "../../A_ETL_Process/output/resultados_a2018.json";
var link_a2021 = "../../A_ETL_Process/output/resultados_a2021.json";
var link;

// SELECT HTML ELEMENTS
var title = d3.select("#nombre-municipio");
// var resultsInfo = d3.select("#election-results");
var demographicInfo = d3.select("#election-results");

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
    demographicInfo.html("")
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

    if (year === 2015) { text = "%  Participación Ciudadana" }
    else if (year === 2018) { text = ""; }
    else if (year === 2021) { text = "|  Promedio NL"; }

    // Pending: Set animation parameters
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

    renderTitle(id_municipio);
    renderResults(id_municipio);
    runYear(id_municipio, 2015);
    runYear(id_municipio, 2018);
    runYear(id_municipio, 2021);

}

// INIT
runEnter(defaultID);


var mapChange = (e) => {
    selectedID = parseInt(e.target.feature.properties.cvegeo);
    optionChanged(selectedID);
    tableGenerator(e);
}


function optionChanged(selectedID) {

    console.log(selectedID);

    results2015.destroy();
    results2018.destroy();
    results2021.destroy();

    part2015.destroy();
    part2018.destroy();
    part2021.destroy();

    runEnter(selectedID);

}


// // CHANGE OPTION FUNCTION
// function optionChanged() {
//     var selectedID = parseInt(dropdown.property('value'));
//     console.log("Selected:", selectedID);

//     results2015.destroy();
//     results2018.destroy();
//     results2021.destroy();

//     part2015.destroy();
//     part2018.destroy();
//     part2021.destroy();

//     runEnter(selectedID);

// }

// Pending: Delete debug MSGs

function tableGenerator(e) {

    demographicInfo.html("");
    demographicInfo.append("p").text(`Municipio: ${e.target.feature.properties.nomgeo}`);
    demographicInfo.append("p").text(`Gini: ${e.target.feature.Gini}`);
    demographicInfo.append("p").text(`Población Total: ${e.target.feature.Population}`);
    demographicInfo.append("p").text(`Grado Promedio de Escolaridad: ${e.target.feature.Scholarship}`);
    demographicInfo.append("p").text(`Población Economicamente Activa: ${e.target.feature.EconomicallyActive / e.target.feature.Population*100}%`);
    // demographicInfo.append("p").text(`Población Desocupada: ${e.target.feature.Unemployment / (e.target.feature.EconomicallyActive+e.target.feature.Unemployment)*100}%`);
    demographicInfo.append("p").text(`Población sin Afiliación a Servicios de Salud: ${e.target.feature.LackOfHS / e.target.feature.Population*100}%`);

}