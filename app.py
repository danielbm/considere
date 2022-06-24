from flask import Flask, send_from_directory
from flask import request, send_file, Response
import pandas as pd
from flask_cors import CORS
import matplotlib.pyplot as plt
import io

app = Flask(__name__, static_folder='app/build', static_url_path='')
CORS(app)

def get_data(items, cut, graphType):
    data = pd.read_csv('data/ipca.csv', sep=';', decimal=',', index_col='YearMo')
    categories = pd.read_csv('data/categories.csv', sep=';', encoding='iso-8859-1', index_col='CodItem')

    items = list(map(lambda x: x+'_'+graphType, items))
    data = data[items]
    data = data[data.index > cut] 
    data['YearMo'] = data.index
    names = {}

    for column in data.columns:
        if column != 'YearMo':
            first_value = float(data[column][data[column].first_valid_index()])
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

    data = get_data(items, cut, graphType)

    data.index = data['YearMo']
    data = data.drop(columns=['YearMo'])
    ax = data.plot(figsize=(15,8), grid=True, fontsize=14)
    ax.set_xlabel(xlabel="Ano", fontsize=14)
    ax.set_ylabel(ylabel="Variação (%)", fontsize=14)
    ax.legend(fontsize=12, loc="lower left")
    bytes = io.BytesIO()
    plt.savefig(bytes, format='png')
    bytes.seek(0)
    return send_file(bytes, mimetype='image/png')

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

