#! /usr/local/bin/python3
import csv
import json

mapping = {'1999': '2006', '2006': '2012', '2012': '2020', '2020': ''}
columns = []
with open('categories.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        if row[0] != 'CodItem':
            columns.append((row[0],row[1],mapping[row[2]]))

with open('categories.js', 'w') as outfile:
    outfile.write("export default ")
    json.dump(columns, outfile)
