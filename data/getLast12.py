#! /usr/local/bin/python3

import sidrapy
import pandas as pd

pd.set_option('display.max_columns', 1000)
pd.set_option('display.width', 1000)

import csv
import json
# subitems ['7171','7432','7446','7479','7487','7521','7548','7559','7604','7615','7620','7626','7661','7683','7697','7713','47656','7767','7787']

def get_table_calculator(table_code, classification):
    data = sidrapy.get_table(
            table_code=table_code, 
            territorial_level="1", 
            variable="2265,66",
            classifications={classification: "all"},
            ibge_territorial_code="all", 
            period=(pd.to_datetime('today')-pd.DateOffset(months=1)).strftime("%Y%m"),
            header="n",
            verify_ssl=False)
    
    weight_data = data[data['D3C'] == '66']
    inf_data = data[data['D3C'] == '2265']
    weight_data = weight_data.rename(columns={"D2C": "YearMo", "D4C": "CodItem", "D4N": "DescItem", "V": "PesoMensal"})
    inf_data = inf_data.rename(columns={"D2C": "YearMo", "D4C": "CodItem", "D4N": "DescItem", "V": "Inflacao12Meses"})
    weight_data = weight_data[['YearMo', 'CodItem', 'PesoMensal']].reset_index()
    inf_data = inf_data[['Inflacao12Meses']].reset_index()
    data = weight_data.join(inf_data, lsuffix='_l', rsuffix='_r')[['CodItem', 'PesoMensal', 'Inflacao12Meses']]
    data['InflacaoPonderada'] = data.apply(lambda row : float(row['PesoMensal'] if row['PesoMensal'] != '...' else 0)/100.0*float(row['Inflacao12Meses'] if row['Inflacao12Meses'] != '...' else 0), axis=1)

    data.index = data['CodItem']
    data = data[['PesoMensal', 'Inflacao12Meses','InflacaoPonderada']]
    # items 
    # subitems ['7171','7432','7446','7479','7487','7521','7548','7559','7604','7615','7620','7626','7661','7683','7697','7713','47656','7767','7787']
    # data = data[data.index.isin(['7171','7432','7446','7479','7487','7521','7548','7559','7604','7615','7620','7626','7661','7683','7697','7713','47656','7767','7787'])]
    data = data[data.index.isin(['7786','7766','7712','7660','7625','7558','7486','7445','7170'])]

    data['PesoMensal'] = data.apply(lambda row : float(row['PesoMensal']), axis=1)
    data['Inflacao12Meses'] = data.apply(lambda row : float(row['Inflacao12Meses']), axis=1)
    # ptable = data.pivot(values=['Inflacao12Meses','PesoMensal'], index=['YearMo'], columns=['CodItem'])
    # ptable = ptable.droplevel(level=0, axis=1)
    # print(ptable)
    return data

def main():
        print("Fetching last 12 for my inf from IBGE...")
        data = get_table_calculator('7060', '315')
        categories = pd.read_csv('categories.csv', index_col='CodItem', encoding='iso-8859-1', sep=';')

        category = []
        for row in data.index:
             category.append(categories.loc[int(row)]['DescItem'])

        data['DescItem'] = category

        print("Writing to csv...")
        data.to_csv('last12.csv', sep=';', decimal=',', float_format='%.8f', encoding='iso-8859-1', index=True )
        print("Done.")

        with open('last12.js', 'w') as outfile:
            outfile.write("export default ")
            data.to_json(path_or_buf=outfile)

if __name__ == "__main__":
    main()