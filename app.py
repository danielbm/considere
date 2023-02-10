from flask import Flask, send_from_directory
from flask import request, send_file, Response, make_response
import pandas as pd
from flask_cors import CORS
import matplotlib.pyplot as plt
import io
import seaborn as sns

app = Flask(__name__, static_folder='app/build', static_url_path='')
CORS(app)
sns.set_theme()

def get_data(items, cut, graphType):
    data = pd.read_csv('data/ipca.csv', sep=';', decimal=',', index_col='YearMo')
    categories = pd.read_csv('data/categories.csv', sep=';', encoding='iso-8859-1', index_col='CodItem')

    items = list(map(lambda x: x+'_'+graphType, items))
    data = data[items]
    data['YearMo'] = data.index
    try:
        first_row = data.iloc[data.index.get_loc(cut) - 1]
        data = data[data.index >= cut]
    except KeyError:
        first_row = data.iloc[0]

    names = {}

    for column in data.columns:
        if column != 'YearMo':
            if not first_row[column]:
                first_value = 1.0
            else:
                first_value = float(first_row[column])
            names[column] = categories.loc[int(column.partition("_")[0])]['DescItem']
            data[column] = data.apply(lambda row : (row[column]/first_value-1)*100, axis=1)

    data = data.rename(columns=names)
    data['YearMo'] = data.apply(lambda row : pd.to_datetime(str(row['YearMo'])[:4]+'-'+str(row['YearMo'])[4:6]), axis=1)
    return data

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, 'index.html') 

@app.route("/graph")
def generate_graph():
    items = request.args.get('items').split(",") if 'items' in request.args else '7169,7170,7445,7486,7558,7625,7660,7712,7766,7786'.split(",")
    cut = int(request.args.get('cut')) if 'cut' in request.args else 199908
    graphType = request.args.get('type') if 'type' in request.args else 'real'
    size = request.args.get('size') if 'size' in request.args else 'mobile'

    data = get_data(items, cut, graphType)

    fontsize = 40 if size == 'mobile' else 16
    data.index = data['YearMo']
    data = data.drop(columns=['YearMo'])
    ax = data.plot(figsize=(15,12), grid=True, fontsize=fontsize)
    ax.set_xlabel(xlabel="Ano", fontsize=fontsize)
    ax.set_ylabel(ylabel="Variação (%)", fontsize=fontsize)
    ax.legend(fontsize=int(fontsize*0.6), loc="best")
    ax.text(1, 0, 'Fonte: IBGE, Gráfico: considereainflacao.com.br', transform=ax.transAxes,
        fontsize=16, color='gray', alpha=0.5,
        ha='right', va='bottom')
    # for line, name in zip(ax.lines, data.columns):
    #     y = line.get_ydata()[-1]
    #     ax.annotate(name, xy=(1, y), xytext=(6, 0),
    #                 color=line.get_color(), xycoords=ax.get_yaxis_transform(),
    #                 textcoords="offset points", size=10, va="center")
    # ax.get_legend().remove()
    ax.figure.autofmt_xdate(ha='center')
    bytes = io.BytesIO()
    plt.savefig(bytes, format='png')
    bytes.seek(0)
    return send_file(bytes, mimetype='image/png')

@app.route("/weighted")
def get_weighted():
    cut = int(request.args.get('cut')) if 'cut' in request.args else 199908
    size = request.args.get('size') if 'size' in request.args else 'mobile'

    data = pd.read_csv('data/weight.csv', sep=';', decimal=',', index_col='YearMo')
    categories = pd.read_csv('data/categories.csv', sep=';', encoding='iso-8859-1', index_col='CodItem')

    items = list(map(lambda x: x+'_weight_acc', "7169,7786,7766,7712,7660,7625,7558,7486,7445,7170".split(",")))
    data = data[items]
    data['YearMo'] = data.index
    data = data.drop(columns=['YearMo'])
    try:
        first_row = data.iloc[data.index.get_loc(cut) - 1]
        data = data[data.index >= cut]
    except KeyError:
        first_row = data.iloc[0]
    names = {}

    for column in data.columns:
        if not first_row[column]:
            first_value = 1.0
        else:
            first_value = float(first_row[column])
        names[column] = categories.loc[int(column.partition("_")[0])]['DescItem']
        data[column] = data.apply(lambda row : (row[column]/first_value-1)*100, axis=1)

    data = data.rename(columns=names)
    return data.iloc[-1].to_dict()

@app.route("/csv")
def export_csv():
    items = request.args.get('items').split(",") if 'items' in request.args else '7169,7170,7445,7486,7558,7625,7660,7712,7766,7786'.split(",")
    cut = int(request.args.get('cut')) if 'cut' in request.args else 199908
    graphType = request.args.get('type') if 'type' in request.args else 'real'

    data = get_data(items, cut, graphType)

    bytes = io.BytesIO()

    data.to_csv(bytes, sep=';', float_format='%.3f', decimal=',', encoding='iso-8859-1', index=False )
    bytes.seek(0)
    response = Response(bytes, mimetype='text/csv')
    response.headers['Content-Disposition'] = 'attachment; filename=dados.csv'
    return response

