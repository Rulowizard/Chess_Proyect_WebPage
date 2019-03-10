from flask import Flask, render_template, redirect, Markup, request , Response, jsonify
import pymongo, json

from chess_engine import (jugador_v0, jugador_v5, boardSVGRepr, initialize_game, 
    call_jugador_v4, global_board)


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
    return render_template("test_svg.html" )

@app.route("/game", methods=["GET"])
def game():
      
    print("game")  
    return Markup(boardSVGRepr(global_board())) 

@app.route("/initialize", methods=["GET"])
def initialize():
    initialize_game()
    print("Game initialized")
    return "Game initialized"

@app.route("/play",methods=["GET"])
def play_game():
    print("Play")
    values = call_jugador_v4()
    return jsonify(values)






if __name__ == "__main__":
    app.run(debug=True)
