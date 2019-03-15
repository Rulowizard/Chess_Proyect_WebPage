from flask import Flask, render_template, redirect, Markup, request , Response, jsonify
import pymongo, json

from chess_engine import ( boardSVGRepr, initialize_game, 
    call_jugador_v4, global_board, global_turn, process_play, jugador_v1, jugador_v2,
    jugador_v3, jugador_v4, jugador_v5)


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

@app.route("/player", methods=["GET"])
def player():

    #Obtener el tablero actual y turno
    board = global_board()
    color = global_turn()

    #Tipo de jugador
    #El valor depues de coma es el default
    player = request.args.get("player", "M1" )
    print(player)
    #Profundidad
    depth = int( request.args.get("depth",0))
    print(depth)

    #Condicionales para saber quien atiende
    if player=="Humano":
        print("Humano")

    elif player =="M1":
        print("M1")
        values =  process_play( jugador_v1(board,color,depth) )

    elif player =="M2":
        print("M2")
        values =  process_play( jugador_v2(board,color,depth) )
    
    elif player =="M3":
        print("M3")
        values =  process_play( jugador_v3(board,color,depth) )

    elif player =="M4":
        print("M4")
        values =  process_play( jugador_v4(board,color,depth) )

    elif player =="M5":
        print("M5")
        values =  process_play( jugador_v1(board,color,depth) )
    print(request.args) 
    return jsonify(values)




if __name__ == "__main__":
    app.run(debug=True)
