from flask import (Flask, render_template, redirect, Markup, request , 
    Response, jsonify,url_for)
import pymongo, json
import chess_scrape

from chess_engine import ( boardSVGRepr, initialize_game, 
    call_jugador_v4, global_board, global_turn, process_play, jugador_v1, jugador_v2,
    jugador_v3, jugador_v4, jugador_v5, get_uci, fen_representation, initialize_game_fen)


# Create an instance of Flask
app = Flask(__name__)  

#Setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db = client.chess

#Global Variables


global flagLoadGame
flagLoadGame=False
global globalFEN
globalFEN=""

# Route to render index.html template using data from Mongo
@app.route("/")
def index():

    # Find one record of data from the mongo database
    # @TODO: YOUR CODE HERE!

    # Return template and data
    print("Home")

    number_of_games = len( list(db.games.find()))

    return render_template("index.html", numb_games= number_of_games)

@app.route("/load")
def load():

    print("Load")

    return render_template("load_page.html")

@app.route("/saved_games",methods=["GET"])
def saved_games():

    #Obtengo lista de todos los juegos guardados
    #Quito de la lsita de resultados el id ya que no es un objeto primitivo
    mongo_games = list( db.games.find({},{"_id":0}))

    return jsonify(mongo_games)

@app.route("/load_game",methods=["GET"])
def load_game():
    global flagLoadGame
    global globalFEN
    globalFEN = request.args.get("fen")
    flagLoadGame=True
    print(globalFEN)
    return "OK"


@app.route("/svg_test")
def test():
    return render_template("test_svg.html" )

@app.route("/game", methods=["GET"])
def game():
      
    print("game")  
    return Markup(boardSVGRepr(global_board())) 

@app.route("/initialize", methods=["GET"])
def initialize():
    global flagLoadGame
    global globalFEN

    if  flagLoadGame==False:
        initialize_game()
        text="Normal Initialize"
    else:
        initialize_game_fen(globalFEN)
        flagLoadGame=False
        globalFEN=""
        text="FEN Initialize"


    print("Game initialized")
    return text

@app.route("/play",methods=["GET"]) 
def play_game():
    print("Play") 
    values = call_jugador_v4()
    return jsonify(values) 

@app.route("/scrape",methods=["GET"])
def scrape():
    info = chess_scrape.scrape()
    return jsonify(info)

@app.route("/save", methods=["GET"])
def save():

    #Recibo string que representa imagen svg
    svg = request.args.get("svg")
    #Obtengo tablero actual
    board = global_board()
    #Obtengo representacion FEN del tablero
    fen = fen_representation(board)
    print("FEN:")
    print(fen)

    db.games.insert_one(
        {
            "svg":svg,
            "fen":fen
        }
    )
    
    

    return jsonify("Info recibida")


@app.route("/player", methods=["GET"])
def player():
    print("-----")
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
        move = request.args.get("clicks")
        uci = get_uci(move)
        values = process_play( uci )
        print(".....")


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
    return jsonify(values)




if __name__ == "__main__":
    app.run(debug=True)
