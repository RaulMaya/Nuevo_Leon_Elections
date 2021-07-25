
console.log("Test API");
var testAPI = "http://127.0.0.1:5000/api/NL_geojson";

d3.json(testAPI).then((data) => {
    console.log(data);
});