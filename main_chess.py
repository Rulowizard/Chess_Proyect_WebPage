from flask import Flask, render_template, redirect
import pymongo

# Create an instance of Flask
app = Flask(__name__)

#Setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db = client.chess


# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    # Find one record of data from the mongo database
    # @TODO: YOUR CODE HERE!

    # Return template and data
    print("Home")
    return render_template("index.html")

@app.route("/load")
def load():

    print("Load")
    return render_template("load_page.html")





if __name__ == "__main__":
    app.run(debug=True)
