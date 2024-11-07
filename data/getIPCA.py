#! /usr/local/bin/python3

import sidrapy
import pandas as pd
import sys
import matplotlib.pyplot as plt

pd.set_option('display.max_columns', 1000)
pd.set_option('display.width', 1000)
# subitems ['7171','7432','7446','7479','7487','7521','7548','7559','7604','7615','7620','7626','7661','7683','7697','7713','47656','7767','7787']

def get_pivot_table_weight(table_code, classification):
    data = sidrapy.get_table(
            table_code=table_code, 
            territorial_level="1", 
            variable="63,66",
            classifications={classification: "all"},
            ibge_territorial_code="all", 
            period="all",
            header="n",
            verify_ssl=False)
    
    weight_data = data[data['D3C'] == '66']
    inf_data = data[data['D3C'] == '63']
    weight_data = weight_data.rename(columns={"D2C": "YearMo", "D4C": "CodItem", "D4N": "DescItem", "V": "PesoMensal"})
    inf_data = inf_data.rename(columns={"D2C": "YearMo", "D4C": "CodItem", "D4N": "DescItem", "V": "InflacaoMensal"})
    weight_data = weight_data[['YearMo', 'CodItem', 'PesoMensal']].reset_index()
    inf_data = inf_data[['InflacaoMensal']].reset_index()
    data = weight_data.join(inf_data, lsuffix='_l', rsuffix='_r')[['YearMo', 'CodItem', 'PesoMensal', 'InflacaoMensal']]
    data['InflacaoPonderada'] = data.apply(lambda row : float(row['PesoMensal'] if row['PesoMensal'] != '...' else 0)/100.0*float(row['InflacaoMensal'] if row['InflacaoMensal'] != '...' else 0), axis=1)
    ptable = data.pivot(values=['InflacaoPonderada'], index=['YearMo'], columns=['CodItem'])
    ptable = ptable.droplevel(level=0, axis=1)

    return ptable
    

def get_pivot_table(table_code, classification):
    data = sidrapy.get_table(
            table_code=table_code, 
            territorial_level="1", 
            variable="63",
            classifications={classification: "all"},
            ibge_territorial_code="all", 
            period="all",
            header="n",
            verify_ssl=False)

    data = data.rename(columns={"D2C": "YearMo", "D4C": "CodItem", "D4N": "DescItem", "V": "InflacaoMensal"})
    ptable = data[['InflacaoMensal','YearMo', 'CodItem']].pivot(values=['InflacaoMensal'], index=['YearMo'], columns=['CodItem'])
    ptable = ptable.droplevel(level=0, axis=1)

    return ptable

def main():
    if sys.argv[1] == 'old':
        print("Fetching data from IBGE...")
        mapping = {'1991': ('58', '72'),
                   '1999': ('655', '315'), 
                   '2006': ('2938', '315'), 
                   '2012': ('1419', '315')}
        for code in mapping:
            print("Fetching "+code+"...")
            data = get_pivot_table(mapping[code][0], mapping[code][1])
            data.to_csv('ipca'+code+'.csv')
        
        print("Fetching weight data from IBGE...")
        mapping = { '2012': ('1419', '315') }
        for code in mapping:
            print("Fetching "+code+"...")
            data = get_pivot_table_weight(mapping[code][0], mapping[code][1])
            data.to_csv('weight'+code+'.csv')

    elif sys.argv[1] == 'fetch':

        print("Fetching current from IBGE...")
        data = get_pivot_table('7060', '315')
        
        print("Writing to csv...")
        data.to_csv('ipca2020.csv')

        # print("Fetching current weight from IBGE...")
        # data = get_pivot_table_weight('7060', '315')
        
        # print("Writing to csv...")
        # data.to_csv('weight2020.csv')
        # print("Done.")

    # elif sys.argv[1] == 'weight':
    #     data2012 = pd.read_csv('weight2012.csv', index_col='YearMo')
    #     data2020 = pd.read_csv('weight2020.csv', index_col='YearMo')

    #     data = pd.concat((data2012, data2020), axis=0)
    #     data = data.sort_index()

    #     for column in data.columns:
    #         acc = []
    #         cnt = 0
    #         for row in data[column]:
    #             prev = 1.0 if (cnt == 0 or not acc[-1]) else acc[-1]
    #             if (row == '...' or pd.isna(row)):
    #                 value = None
    #             else:
    #                 value = prev*(1+float(row)/100)
    #             acc.append(value)
    #             cnt +=1
    #         data = pd.concat((data, pd.DataFrame({column+'_acc': acc}, index=data.index)), axis=1)

    #     curr_inf = data['7169_acc'].iat[-1]
        
    #     for column in data:
    #         if not column.endswith('_acc'):
    #             data[column+'_real'] = data.apply(lambda row : curr_inf/row['7169_acc']*row[column+'_acc'], axis=1)

    #     data.to_csv('weight.csv', sep=';', float_format='%.3f', decimal=',')
        # ax = table.plot(kind='bar', stacked=True)
        # ax.legend(bbox_to_anchor=(1.04,1), loc="upper left")
        # fig = ax.get_figure()
        # fig.savefig("results.png", bbox_inches="tight")

    elif sys.argv[1] == 'categories':
        mapping = {'1999': ('655', '315'), 
                   '2006': ('2938', '315'), 
                   '2012': ('1419', '315'),
                   '2020': ('7060', '315')}

        print("Fetching data from IBGE...")

        categories = pd.DataFrame()
        for code in mapping:
            print("Fetching "+code+"...")
            data = sidrapy.get_table(
                table_code=mapping[code][0], 
                territorial_level="1", 
                variable="63",
                classifications={"315": "all"},
                ibge_territorial_code="all", 
                period="last",
                header="n",
                verify_ssl=False)

            data = data.rename(columns={"D2C": "YearMo", "D4C": "CodItem", "D4N": "DescItem", "V": "InflacaoMensal"})
            data = data[['CodItem', 'DescItem']]
            data['Ano'] = code
            data.to_csv('categories'+code+'.csv', index=False)
            categories = categories.combine_first(data)
        
        data1999 = pd.read_csv('categories1999.csv', index_col='CodItem')
        data2006 = pd.read_csv('categories2006.csv', index_col='CodItem')
        data2012 = pd.read_csv('categories2012.csv', index_col='CodItem')
        data2020 = pd.read_csv('categories2020.csv', index_col='CodItem')

        data = data1999
        data = pd.concat([data[~data.index.isin(data2006.index)], data2006])
        data = pd.concat([data[~data.index.isin(data2012.index)], data2012])
        data = pd.concat([data[~data.index.isin(data2020.index)], data2020])

        data = data.sort_values(by='DescItem')

        data.to_csv('categories.csv', sep=';', float_format='%.3f', decimal=',', encoding='iso-8859-1', index=True )


    elif sys.argv[1] == 'generate':
        data1999 = pd.read_csv('ipca1999.csv', index_col='YearMo')
        data2006 = pd.read_csv('ipca2006.csv', index_col='YearMo')
        data2012 = pd.read_csv('ipca2012.csv', index_col='YearMo')
        data2020 = pd.read_csv('ipca2020.csv', index_col='YearMo')

        data = pd.concat((data1999, data2006, data2012, data2020), axis=0)
        data = data.sort_index()

        for column in data.columns:
            acc = []
            cnt = 0
            for row in data[column]:
                prev = 1.0 if (cnt == 0 or not acc[-1]) else acc[-1]
                if (row == '...' or pd.isna(row)):
                    value = None
                else:
                    value = prev*(1+float(row)/100)
                acc.append(value)
                cnt +=1
            data = pd.concat((data, pd.DataFrame({column+'_acc': acc}, index=data.index)), axis=1)

        curr_inf = data['7169_acc'].iat[-1]
        
        for column in data:
            if not column.endswith('_acc'):
                data[column+'_real'] = data.apply(lambda row : curr_inf/row['7169_acc']*row[column+'_acc'], axis=1)

        data.to_csv('ipca.csv', sep=';', float_format='%.8f', decimal=',')
    
    elif sys.argv[1] == 'generateWeight':
        data2012 = pd.read_csv('weight2012.csv', index_col='YearMo')
        data2020 = pd.read_csv('weight2020.csv', index_col='YearMo')

        data = pd.concat((data2012, data2020), axis=0)
        data = data.sort_index()
        data = data[['7169','7786','7766','7712','7660','7625','7558','7486','7445','7170']]

        for column in data.columns:
            acc = []
            cnt = 0
            for row in data[column]:
                prev = 1.0 if (cnt == 0 or not acc[-1]) else acc[-1]
                if (row == '...' or pd.isna(row)):
                    value = None
                else:
                    value = prev*(1+float(row)/100)
                acc.append(value)
                cnt +=1
            data = pd.concat((data, pd.DataFrame({column+'_weight_acc': acc}, index=data.index)), axis=1)
        
        data.to_csv('weight.csv', sep=';', float_format='%.12f', decimal=',')

    else:
        try:
            str(sys.argv[1])
            items = sys.argv[1].split(",")
        except:
            print("Wrong parameters\n./getIPCA <fetch|categories|number>\n")
            return

        print("Reading CSV...")
        data = pd.read_csv('ipca.csv', sep=';', decimal=',', index_col='YearMo')
        categories = pd.read_csv('categories.csv', index_col='CodItem')

        print("Applying formats...")
        items = list(map(lambda x: x+'_real', items))
        data = data[items]
        if len(sys.argv) > 2:
            data = data[data.index > int(sys.argv[2])] 
        data['YearMo'] = data.index
        names = {}


        for column in data.columns:
            if column != 'YearMo':
                first_value = float(data[column][data[column].first_valid_index()])
                names[column] = categories.loc[int(column[:-5])]['DescItem']
                data[column] = data.apply(lambda row : (row[column]/first_value-1)*100, axis=1)

        print("Writing CSV...")
        data = data.rename(columns=names)
        data['YearMo'] = data.apply(lambda row : pd.to_datetime(str(row['YearMo'])[:4]+'-'+str(row['YearMo'])[4:6]), axis=1)
        data.to_csv('results.csv', sep=';', float_format='%.3f', decimal=',', encoding='iso-8859-1', index=False )

        print("Writing Graph...")
        data.index = data['YearMo']
        data = data.drop(columns=['YearMo'])
        ax = data.plot(figsize=(15,8), grid=True, xlabel="Ano", ylabel="Variação (%)")
        for line, name in zip(ax.lines, data.columns):
            y = line.get_ydata()[-1]
            ax.annotate(name, xy=(1, y), xytext=(6, 0),
                        color=line.get_color(), xycoords=ax.get_yaxis_transform(),
                        textcoords="offset points", size=8, va="center")
        ax.get_legend().remove()
        plt.savefig('results.png')


if __name__ == "__main__":
    main()