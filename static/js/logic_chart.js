// DEFAULT ID
var defaultID = 19001;

// ENDPOINTS
var link;
var link_id = "../../A_ETL_Process/output/id_municipios.json";
var link_a2015 = "../../A_ETL_Process/output/resultados_a2015.json";
var link_a2018 = "../../A_ETL_Process/output/resultados_a2018.json";
var link_a2021 = "../../A_ETL_Process/output/resultados_a2021.json";
var link_iter = "../../A_ETL_Process/output/iter_1920r.js";
var link_gini = "../../A_ETL_Process/output/dataframe_merged_apisr.js";
var link_sup = "../../A_ETL_Process/output/superficie_NL.json";

// SELECT HTML ELEMENTS
var demographicInfo = d3.select("#info-row");

// RENDER RESULTS FUNCTION
function renderInfo(id_municipio) {

    d3.json(link_iter).then((iter_data) => {
        d3.json(link_gini).then((gini_data) => {
            d3.json(link_sup).then((sup_data) => {

                var rowIter = iter_data.find((d) => d.ID === id_municipio);
                var rowGini = gini_data.find((d) => d.ID === id_municipio);
                var rowSup = sup_data.find((d) => d.ID === id_municipio);
                var poblacionNL = iter_data.map(d => d.POBTOT);
                var pobNL = math.add(...poblacionNL);

                var info = [
                    rowSup.Municipio,
                    rowGini.GINI.toFixed(2),
                    `${rowIter.POBTOT} (${(rowIter.POBTOT / pobNL * 100).toFixed(2)}% NL)`,
                    `${(rowIter.POBTOT / rowSup.Superficie).toFixed(1)} p/km2`,
                    `${parseFloat(rowIter.GRAPROES).toFixed(1)} years`,
                    `${(rowIter.PDESOCUP / rowIter.PEA * 100).toFixed(2)}%`,
                    `${(rowIter.PSINDER / rowIter.POBTOT * 100).toFixed(2)}%`
                ];

                demographicInfo.html("").selectAll('td')
                    .data(info)
                    .enter()
                    .append('td')
                    .classed('text-center', true)
                    .append('small')
                    .text(function (d) {
                        return d;
                    });
                //         .style('font-size', '11.5px')
                //         .style('font-weight', 'bold');

            });
        });
    });
}

// RENDER CHART.JS FUNCTION
function renderChartJS(x, y, year) {

    // Pending: choose pretty colors & alpha
    var color = ['blue', 'red', 'orange', 'brown', 'gray'];

    var chart2015 = document.getElementById("chart-2015").getContext('2d');
    var chart2018 = document.getElementById("chart-2018").getContext('2d');
    var chart2021 = document.getElementById("chart-2021").getContext('2d');

    // Set chart parameters
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
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { grid: { display: false } } },
            plugins: {
                title: { display: true, text: year, align: "center", font: { size: 17 } },
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

    if (year === 2015) { text = "%  Voters Turnout" }
    else if (year === 2018) { text = ""; }
    else if (year === 2021) { text = "|  NL Mean"; }

    // Set bar parameters
    params = {
        data: {
            labels: ['', '%', ''],
            datasets: [{
                type: 'bar',
                data: [0, partMunicipio, 0],
                backgroundColor: "yellow",
                barThickness: 8,
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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: text, align: "end", font: { size: 13 } },
                legend: { display: false }
            },
            scales: { x: { min: 0, max: 100 }, grid: { display: false } },
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
        var partNL = math.add(...totalVotos) / math.add(...listaNominal) * 100;
        var partMunicipio = rowMunicipio.Total / rowMunicipio.LNominal * 100;

        renderBarJS(partMunicipio, partNL, year);

    });
}

// RUN ENTER FUNCTION
function runEnter(id_municipio) {

    renderInfo(id_municipio);
    runYear(id_municipio, 2015);
    runYear(id_municipio, 2018);
    runYear(id_municipio, 2021);

}

// INIT
runEnter(defaultID);

// MAP CHANGE FUNCTION
var mapChange = (e) => {
    selectedID = parseInt(e.target.feature.properties.cvegeo);
    optionChange(selectedID);
    // tableGenerator(e);
}

// OPTION CHANGE FUNCTION
function optionChange(selectedID) {

    console.log(selectedID);

    results2015.destroy();
    results2018.destroy();
    results2021.destroy();

    part2015.destroy();
    part2018.destroy();
    part2021.destroy();

    runEnter(selectedID);
}