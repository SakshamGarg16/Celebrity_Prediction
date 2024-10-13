from flask import Flask,request,jsonify
import util
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins="*")

@app.route('/classify_image',methods =["GET","POST"])
def classify():
    image = request.json['image']
    
    response = jsonify(util.classify_image(image))
    response.headers.add('Access-Control-Allow-Origin','*')
    
    return response 

if __name__ == '__main__':
    util.retrievefiles()
    app.run()