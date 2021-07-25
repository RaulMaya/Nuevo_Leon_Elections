## DEPENDENCIES
import pymongo
from bson.json_util import dumps, loads
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

## DATABASE SETUP (MongoDB)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.Elections_DB

## FLASK SETUP
app = Flask(__name__)

## FLASK ROUTES
## Homepage
@app.route("/")
def home():
    """Homepage"""
    return (
        f"NL Elections API<br/><br/>"
        f"Available Routes:<br/>"
        f"/api/iter<br/>"
        f"/api/gini<br/>"
        f"/api/superficie_NL<br/>"
        f"/api/a2015<br/>"
        f"/api/a2018<br/>"
        f"/api/a2021<br/>"
        f"/api/g2015<br/>"
        f"/api/g2021<br/>"
        f"/api/NL_geojson<br/>"
        f"/api/coordinates<br/>"
    )

@app.route("/api/iter")
@cross_origin(origin='*')
def id_municipios():
    """Iter"""
    print("Server received request for 'ID Municipios' page...")
    cursor = db.iter_1920r.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/gini")
@cross_origin(origin='*')
def gini():
    """Gini"""
    print("Server received request for 'Gini Index NL' page...")
    cursor = db.dataframe_merged_apisr.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/superficie_NL")
@cross_origin(origin='*')
def superficie_NL():
    """Superficie NL"""
    print("Server received request for 'Superficie NL' page...")
    cursor = db.superficie_NL.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/a2015")
@cross_origin(origin='*')
def a2015():
    """Ayuntamientos 2015"""
    print("Server received request for 'Ayuntamientos 2015' page...")
    cursor = db.resultados_a2015.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/a2018")
@cross_origin(origin='*')
def a2018():
    """Ayuntamientos 2018"""
    print("Server received request for 'Ayuntamientos 2018' page...")
    cursor = db.resultados_a2018.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/a2021")
@cross_origin(origin='*')
def a2021():
    """Ayuntamientos 2021"""
    print("Server received request for 'Ayuntamientos 2021' page...")
    cursor = db.resultados_a2021.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/g2015")
@cross_origin(origin='*')
def g2015():
    """Gubernatura 2015"""
    print("Server received request for 'Gubernatura 2015' page...")
    cursor = db.resultados_g2015.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/g2021")
@cross_origin(origin='*')
def g2021():
    """Gubernatura 2021"""
    print("Server received request for 'Gubernatura 2021' page...")
    cursor = db.resultados_g2021.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

@app.route("/api/NL_geojson")
@cross_origin(origin='*')
def NL_geojson():
    """NL geoJSON"""
    print("Server received request for 'NL geoJSON' page...")
    cursor = db.nl_geojson.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur[0])
    return json_data

@app.route("/api/coordinates")
@cross_origin(origin='*')
def coordinates():
    """NL Coordinates"""
    print("Server received request for 'NL coordinates' page...")
    cursor = db.coordinatesr.find({}, {'_id': False})
    list_cur = list(cursor)
    json_data = dumps(list_cur)
    return json_data

## RUN FLASK APP
if __name__ == "__main__":
    app.run(debug=True)
