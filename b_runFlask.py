## STEP 2:
## Run Flask to enable API server

## Dependencies
import pymongo
from bson.json_util import dumps, loads
from flask import Flask, jsonify, render_template
from flask_cors import CORS, cross_origin

## Database Setup (MongoDB)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.Elections_DB

## Flask Setup
app = Flask(__name__)

## Flask Routes
## Homepage
@app.route("/")
def home():

    return render_template("/index.html")


@app.route("/index.html")
def index():

    return render_template("/index.html")


@app.route("/api/iter")
@cross_origin(origin='*')
def id_municipios():
    """Iter"""
    print("Server received request for 'Iter' page...")
    cursor = db.iter_1920r.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/gini")
@cross_origin(origin='*')
def gini():
    """Gini"""
    print("Server received request for 'Gini Index NL' page...")
    cursor = db.dataframe_merged_apisr.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/superficie_NL")
@cross_origin(origin='*')
def superficie_NL():
    """Superficie NL"""
    print("Server received request for 'Superficie NL' page...")
    cursor = db.superficie_NL.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/a2015")
@cross_origin(origin='*')
def a2015():
    """Ayuntamientos 2015"""
    print("Server received request for 'Ayuntamientos 2015' page...")
    cursor = db.resultados_a2015.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/a2018")
@cross_origin(origin='*')
def a2018():
    """Ayuntamientos 2018"""
    print("Server received request for 'Ayuntamientos 2018' page...")
    cursor = db.resultados_a2018.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/a2021")
@cross_origin(origin='*')
def a2021():
    """Ayuntamientos 2021"""
    print("Server received request for 'Ayuntamientos 2021' page...")
    cursor = db.resultados_a2021.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/g2015")
@cross_origin(origin='*')
def g2015():
    """Gubernatura 2015"""
    print("Server received request for 'Gubernatura 2015' page...")
    cursor = db.resultados_g2015.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/g2021")
@cross_origin(origin='*')
def g2021():
    """Gubernatura 2021"""
    print("Server received request for 'Gubernatura 2021' page...")
    cursor = db.resultados_g2021.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data

@app.route("/api/NL_geojson")
@cross_origin(origin='*')
def NL_geojson():
    """NL geoJSON"""
    print("Server received request for 'NL GeoJSON' page...")
    cursor = db.nl_geojson.find({}, {'_id': False})
    json_data = dumps(list(cursor)[0])
    return json_data

@app.route("/api/coordinates")
@cross_origin(origin='*')
def coordinates():
    """NL Coordinates"""
    print("Server received request for 'NL Coordinates' page...")
    cursor = db.coordinatesr.find({}, {'_id': False})
    json_data = dumps(list(cursor))
    return json_data


## RUN FLASK APP
if __name__ == "__main__":
    app.run(debug=True)