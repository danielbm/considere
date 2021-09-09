#! /usr/local/bin/python3
import csv
import datetime
import mysql.connector

cnx = mysql.connector.connect(user='ipca', password='inflacao',
                              host='127.0.0.1',
                              database='inflacao')
mycursor = cnx.cursor()

dadosHist = []
with open('dadosHist.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        if row[0] != 'year':
            dadosHist.append((int(row[0]), int(row[1]), float(row[2]), float(row[3]), float(row[4]), float(row[5])))
            sql = "INSERT INTO quotes (year, month, minimo, ipca, dolar, ibov) VALUES (" + row[0] +","+ row[1] +","+ row[2] +","+ row[3] +","+ row[4] +","+ row[5] + ")"
            print(sql)
            mycursor.execute(sql)

cnx.commit()
cnx.close()
