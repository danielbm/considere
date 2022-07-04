#! /usr/local/bin/python3
import csv
import json

# mapping = {'1999': '2006', '2006': '2012', '2012': '2020', '2020': ''}
# columns = []
# with open('categories.csv', newline='') as csvfile:
#     reader = csv.reader(csvfile, delimiter=';')
#     for row in reader:
#         if row[0] != 'CodItem':
#             columns.append((row[0],row[1],mapping[row[2]]))

# with open('categories.js', 'w') as outfile:
#     outfile.write("export default ")
#     json.dump(columns, outfile)

mapping = {'1999': '2006', '2006': '2012', '2012': '2020', '2020': ''}
columns = []
tree = []
with open('categories.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    grupo,subgrupo,item = -1,-1,-1
    for row in reader:
        if row[0] != 'CodItem':
            if row[1].find(".") == -1:
                continue
            codigo = row[1][:row[1].find(".")]
            if len(codigo) == 1:
                grupo,subgrupo,item = grupo+1,-1,-1
                tree.append({'label': row[1], 'children': [], 'CodItem': row[0], 'year': mapping[row[2]]})
            if len(codigo) == 2:
                grupo,subgrupo,item = grupo,subgrupo+1,-1
                tree[grupo]['children'].append({'label': row[1], 'children': [], 'CodItem': row[0], 'year': mapping[row[2]]})
            if len(codigo) == 4:
                grupo,subgrupo,item = grupo,subgrupo,item+1
                tree[grupo]['children'][subgrupo]['children'].append({'label': row[1], 'children': [], 'CodItem': row[0], 'year': mapping[row[2]]})
            if len(codigo) == 7:
                grupo,subgrupo,item = grupo,subgrupo,item
                tree[grupo]['children'][subgrupo]['children'][item]['children'].append({'label': row[1], 'CodItem': row[0], 'year': mapping[row[2]]})

supertree = { 'label': 'Todos componentes', 'children': tree, 'CodItem': "0", 'year': ''}
print(tree)

with open('categories.js', 'w') as outfile:
    outfile.write("export default ")
    json.dump(supertree, outfile)
