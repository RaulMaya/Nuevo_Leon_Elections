## STEP 1:
## Load files stored in A_ETL_Process/output into MongoDB

## Dependencies
import pymongo
import json

## Setup database connection (MongoDB)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)

## Drop existing database
client.drop_database('Elections_DB')

## Set database variable
db = client.Elections_DB

## NL GeoJSON
with open("resources/maps/NYU-NL-geojson.json") as file:
  file_data = json.load(file)
db.nl_geojson.insert_one(file_data)

## ID Municipios
with open("A_ETL_Process/output/id_municipios.json") as file:
  file_data = json.load(file)
db.id_municipios.insert_many(file_data)

## Superficie NL
with open("A_ETL_Process/output/superficie_NL.json") as file:
  file_data = json.load(file)
db.superficie_NL.insert_many(file_data)

## Resultados Ayuntamientos 2015
with open("A_ETL_Process/output/resultados_a2015.json") as file:
  file_data = json.load(file)
db.resultados_a2015.insert_many(file_data)

## Resultados Ayuntamientos 2018
with open("A_ETL_Process/output/resultados_a2018.json") as file:
  file_data = json.load(file)
db.resultados_a2018.insert_many(file_data)

## Resultados Ayuntamientos 2021
with open("A_ETL_Process/output/resultados_a2021.json") as file:
  file_data = json.load(file)
db.resultados_a2021.insert_many(file_data)

## Resultados Gubernatura 2015
with open("A_ETL_Process/output/resultados_g2015.json") as file:
  file_data = json.load(file)
db.resultados_g2015.insert_many(file_data)

## Resultados Gubernatura 2021
with open("A_ETL_Process/output/resultados_g2021.json") as file:
  file_data = json.load(file)
db.resultados_g2021.insert_many(file_data)

## Gini Index NL
with open("A_ETL_Process/output/dataframe_merged_apisr.js") as file:
  file_data = json.load(file)
db.dataframe_merged_apisr.insert_many(file_data)

## Census 2020
with open("A_ETL_Process/output/iter_1920r.js") as file:
  file_data = json.load(file)
db.iter_1920r.insert_many(file_data)

## NL Coordinates
with open("A_ETL_Process/output/coordinatesr.js") as file:
  file_data = json.load(file)
db.coordinatesr.insert_many(file_data)

print("Loading to MongoDB is complete :)")