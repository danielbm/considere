#! /usr/local/bin/python3
import csv
import json

columns = []
with open('categories.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        if row[0] != 'CodItem':
            columns.append((row[0],row[1]))

with open('categories.js', 'w') as outfile:
    outfile.write("export default ")
    json.dump(columns, outfile)
