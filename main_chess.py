from flask import Flask, render_template, redirect, Markup
import pymongo

from chess_engine import play_game, jugador_v0, jugador_v5, boardSVGRepr


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

    number_of_games = len( list(db.games.find()))
    print(number_of_games)

    return render_template("index.html", numb_games= number_of_games)

@app.route("/load")
def load():

    print("Load")

    saved_games = list(db.games.find())
    return render_template("load_page.html", saved_games=saved_games)

@app.route("/svg_test")
def test():
    juego = play_game(jugador_v5,jugador_v0,depth=0,visual=None)
    
    

    return render_template("test_svg.html", svg= Markup( boardSVGRepr(juego[2])) )
    





if __name__ == "__main__":
    app.run(debug=True)
