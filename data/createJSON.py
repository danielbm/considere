#! /usr/local/bin/python3
import csv
import json

dadosHist = []

columns = {}
with open('dadosHist.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        if row[0] == 'year':
            headers = row
            for i in range(2,len(row)):
                columns[headers[i]] =[]
        else:
            for i in range(2,len(row)):
                if row[i]:
                    columns[headers[i]].append({"year": int(row[0]), "month": int(row[1]), "value": float(row[i].replace(",","."))})

with open('dadosHist.js', 'w') as outfile:
    outfile.write("export default ")
    json.dump(columns, outfile)
