from flask import (Flask, render_template, redirect, Markup, request , 
    Response, jsonify,url_for)
import pymongo, json
import chess_scrape

from sqlalchemy import create_engine
import pymysql
pymysql.install_as_MySQLdb()

import pandas as pd

engine = create_engine ("mysql://root:Aa1$0110m@localhost/chess_db")

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

@app.route("/statistics")
def statistics():
    return render_template("statistics_page.html" )

@app.route("/game", methods=["GET"])
def game():
      
    print("game")  
    #return Markup(boardSVGRepr(global_board()))
    return jsonify( boardSVGRepr(global_board())) 

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
    board = global_board()
    values = process_play( jugador_v4(board,color,0),"M4",0 )
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

@app.route("/mysql",methods=["GET"])
def mySQL():
    #Me conecto con la BD de MySQL
    conn = engine.connect()
    plays_df = pd.read_sql("Select * FROM plays",conn)
    plays_df = plays_df.drop( ["id","x_axis","y_axis"] , axis=1)
    plays_dict = plays_df.to_dict("records")
    return jsonify(plays_dict)

@app.route("/bars",methods=["GET"])
def bars():
    conn = engine.connect()
    min_turn = request.args.get("min")
    max_turn = request.args.get("max")
    depth = request.args.get("depth")
    player = request.args.get("player")
    q1= "Select end_game_mode,count(playerplays_type) from plays "
    q2= "where winner<>'' "
    limit_turn = "and game_len>"+str(min_turn)+" and game_len<"+str(max_turn)+" "
    q4="group by end_game_mode"

    if(depth =="Depth 0"):
        depth_str = "and depth=0 "
    elif (depth == "Depth 1"):
        depth_str = "and depth=1 "
    elif (depth == "Depth 2"):
        depth_str = "and depth=2 "
    else:
        depth_str = ""

    
    machine_str ="and playerplays_type = 'M1' "
    str1= limit_turn + depth_str + machine_str
    df1= pd.read_sql( q1+q2+str1+q4, conn )
    labels1= list(df1["end_game_mode"])
    values1 = list( df1["count(playerplays_type)"] )
    info1=[labels1,values1]

    
    machine_str ="and playerplays_type = 'M2' "
    str2= limit_turn + depth_str + machine_str
    df2= pd.read_sql( q1+q2+str2+q4, conn )
    labels2= list(df2["end_game_mode"])
    values2 = list( df2["count(playerplays_type)"] )
    info2=[labels2,values2]

    
    machine_str ="and playerplays_type = 'M3' "
    str3= limit_turn + depth_str + machine_str
    df3= pd.read_sql( q1+q2+str3+q4, conn )
    labels3= list(df3["end_game_mode"])
    values3 = list( df3["count(playerplays_type)"] )
    info3=[labels3,values3]

    
    machine_str ="and playerplays_type = 'M4' "
    str4= limit_turn + depth_str + machine_str
    df4= pd.read_sql( q1+q2+str4+q4, conn )
    labels4= list(df4["end_game_mode"])
    values4 = list( df4["count(playerplays_type)"] )
    info4=[labels4,values4]


    machine_str ="and playerplays_type = 'M5' "
    str5= limit_turn + depth_str + machine_str
    df5= pd.read_sql( q1+q2+str5+q4, conn )
    labels5= list(df5["end_game_mode"])
    values5 = list( df5["count(playerplays_type)"] )
    info5=[labels5,values5]


    machine_str=""
    str6= limit_turn + depth_str + machine_str
    df6= pd.read_sql( q1+q2+str6+q4, conn )
    labels6= list(df6["end_game_mode"])
    values6 = list( df6["count(playerplays_type)"] )
    info6=[labels6,values6]

    
    return jsonify( [info1,info2,info3,info4,info5,info6]  )



@app.route("/quickStats",methods=["GET"])
def quickStats():
    conn = engine.connect()
    df = pd.read_sql("Select * FROM plays",conn)
    #Depuro DF
    df = df.drop( ["x_axis","y_axis"] , axis=1)
    #DF que sólo contiene la info de las partidas acabadas
    tabla_fin_partida = df.loc[ df["winner"] != ""  ]
    total_movimientos= df["id"].max()
    total_posiciones_evaluadas = df["mov_len"].sum()
    total_de_partidas = tabla_fin_partida["winner"].count()
    #Agrupo tabla fin partida para id mejor y peor jugador
    temp = tabla_fin_partida.loc[ tabla_fin_partida["end_game_mode"] == "checkmate" ]
    clasif_jugadores = temp.groupby(["playerplays_type"])["winner"].count()
    #Mejor jugador
    mejor_jugador_name = clasif_jugadores.index[4]
    mejor_jugador_score = clasif_jugadores[4]
    #Peor jugador
    peor_jugador_name = clasif_jugadores.index[0]
    peor_jugador_score = clasif_jugadores[0]
    #Resultados
    info = [ int(total_movimientos), int(total_posiciones_evaluadas), int(total_de_partidas),  
        mejor_jugador_name, int(mejor_jugador_score), peor_jugador_name, int(peor_jugador_score)  ]
    return jsonify( info  )


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
        values = process_play( uci , "H",0 )
        print(".....")


    elif player =="M1":
        print("M1")
        values =  process_play( jugador_v1(board,color,depth) , "M1",0 )
        

    elif player =="M2":
        print("M2")
        values =  process_play( jugador_v2(board,color,depth) , "M2",0 )
    
    elif player =="M3":
        print("M3")
        values =  process_play( jugador_v3(board,color,depth) , "M3",0 )

    elif player =="M4":
        print("M4")
        values =  process_play( jugador_v4(board,color,depth) , "M4",0 )

    elif player =="M5":
        print("M5")
        values =  process_play( jugador_v5(board,color,depth) , "M5", depth )
    return jsonify(values)




if __name__ == "__main__":
    app.run(debug=True)
