import pandas as pd
import sys
import matplotlib.pyplot as plt

print("Reading CSV...")
# data = pd.read_csv('ipca.csv', sep=';', decimal=',', index_col='YearMo', low_memory=False)
categories = pd.read_csv('categories.csv', sep=';', encoding='iso-8859-1', index_col='CodItem')
weight = pd.read_csv('weight2020.csv', index_col='YearMo')

weight = weight.tail(1)

names = {}
for column in weight.columns:
    if column != 'YearMo':
        names[column] = categories.loc[int(column)]['DescItem']
weight = weight.rename(columns=names)
print(weight)
weight.to_csv('curr_Weight.csv', sep=';', float_format='%.3f', decimal=',', encoding='iso-8859-1', index=False )

# items = ['7169','7786','7766','7712','7660','7625','7558','7486','7445','7170']
# items = list(categories.index)
# graphType = 'real'
# cut = 202201

# items = list(map(lambda x: str(x)+'_'+graphType, items))
# data = data[items]
# data['YearMo'] = data.index
# try:
#     first_row = data.iloc[data.index.get_loc(cut) - 1]
#     data = data[data.index >= cut]
# except KeyError:
#     first_row = data.iloc[0]

# names = {}

# for column in data.columns:
#     if column != 'YearMo':
#         if not first_row[column]:
#             first_value = 1.0
#         else:
#             first_value = float(first_row[column])
#         names[column] = categories.loc[int(column.partition("_")[0])]['DescItem']
#         data[column] = data.apply(lambda row : (row[column]/first_value-1)*100, axis=1)

# data = data.rename(columns=names)
# data['YearMo'] = data.apply(lambda row : pd.to_datetime(str(row['YearMo'])[:4]+'-'+str(row['YearMo'])[4:6]), axis=1)

# data = data.tail(1)
# print("Writing CSV...")
# data.to_csv('results.csv', sep=';', float_format='%.3f', decimal=',', encoding='iso-8859-1', index=False )
