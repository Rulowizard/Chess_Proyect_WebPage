////////////////////////////////////////////////////////////////////////////////////////
//Sección para variables globales
min_val=1
max_val=633
var bar_datos;


////////////////////////////////////////////////////////////////////////////////////////
//Sección para funciones filtro
function selectDepth0(data){
    return data.depth == 0
}

function selectDepth1(data){
    return data.depth == 1
}

function selectDepth2(data){
    return data.depth == 2
}

function selectEndGame(data){
    return data.winner != ""
}

function selectM1(data){
    return data.playerplays_type == "M1"
}

function selectM2(data){
    return data.playerplays_type == "M2"
}

function selectM3(data){
    return data.playerplays_type == "M3"
}

function selectM4(data){
    return data.playerplays_type == "M4"
}

function selectM5(data){
    return data.playerplays_type == "M5"
}

function selectMinTurn(data){
    return data.game_len >= min_val
}

function selectMaxTurn(data){
    return data.game_len<= max_val
}


////////////////////////////////////////////////////////////////////////////////////////
//Seccion para funciones que extraen valores de las listas de selección
function getSelDepth(){
    return d3.select("#selDepth").property("value")
}

function getSelPlayer(){
    return d3.select("#selPlayer").property("value")
}

////////////////////////////////////////////////////////////////////////////////////////
//Sección para las funciones que dibujan gráficas
function drawBarWinner(data=bar_datos){
    var player = getSelPlayer()
    var info_arr=[]

    switch(player){
        case "All":
            var t1 ={
                y: data[0][1],
                x: data[0][0],
                name:"M1",
                type:"bar"
            };
            var t2 ={
                y: data[1][1],
                x: data[1][0],
                name:"M2",
                type:"bar"
            };
            var t3 ={
                y: data[2][1],
                x: data[2][0],
                name:"M3",
                type:"bar"
            };
            var t4 ={
                y: data[3][1],
                x: data[3][0],
                name:"M4",
                type:"bar"
            };
            var t5 ={
                y: data[4][1],
                x: data[4][0],
                name:"M5",
                type:"bar"
            };
            info_arr=[t1,t2,t3,t4,t5];
            var layout = {barmode:"stack"};
            Plotly.newPlot("img-2",info_arr,layout)
        break;

        case "Machine 1":
            var t ={
                y: data[0][1],
                x: data[0][0],
                type:"bar"
            };
            info_arr=[t];
            Plotly.newPlot("img-2",info_arr)
        break;

        case "Machine 2":
            var t ={
                y: data[1][1],
                x: data[1][0],
                type:"bar"
            };
            info_arr=[t];
            Plotly.newPlot("img-2",info_arr)
        break;

        case "Machine 3":
            var t ={
                y: data[2][1],
                x: data[2][0],
                type:"bar"
            };
            info_arr=[t];
            Plotly.newPlot("img-2",info_arr)
        break;

        case "Machine 4":
            var t ={
                y: data[3][1],
                x: data[3][0],
                type:"bar"
            };
            info_arr=[t];
            Plotly.newPlot("img-2",info_arr)
        break;

        case "Machine 5":
            var t ={
                y: data[4][1],
                x: data[4][0],
                type:"bar"
            };
            info_arr=[t];
            Plotly.newPlot("img-2",info_arr)
        break;
    }
}



function drawHistogramPosEvaluated(data=datos){
    console.log("hOLA")
    drawBarWinner()
    var valor = getSelDepth()
    var player = getSelPlayer()

    //Filtrar por profundidad
    switch(valor){
        case "Depth 1":
            filtered_data = data.filter(selectDepth1);
            break;
        case "Depth 2":
            //obtener info filtrada
            filtered_data = data.filter(selectDepth2);
            break;
        case "Depth 0":
            //obtener info filtrada
            filtered_data = data.filter(selectDepth0);
            break;
        default:
            //obtener info filtrada
            filtered_data = data
            break;
    }

    //Filtrar por jugador
    switch(player){
        case "Machine 1":
            filtered_data = filtered_data.filter(selectM1);
            break;
        case "Machine 2":
            filtered_data = filtered_data.filter(selectM2);
            break;
        case "Machine 3":
            filtered_data = filtered_data.filter(selectM3);
            break;
        case "Machine 4":
            filtered_data = filtered_data.filter(selectM4);
            break;
        case "Machine 5":
            filtered_data = filtered_data.filter(selectM5);
            break;
    }

    //Filtrar por turno
    filtered_data = filtered_data.filter(selectMaxTurn)
    filtered_data = filtered_data.filter(selectMinTurn)

    //Preparar info
    var hist_mov_len = {
        x: filtered_data.map( row => row.mov_len ),
        type: "histogram",
    };
    //Dibujar histograma
    var hist_info = [hist_mov_len];
    Plotly.newPlot("img", hist_info)
    
}

function slider(data){
    min_val = data[0]
    max_val = data[1]
    drawHistogramPosEvaluated()
}

function init(){
    $.get("mysql", function(data){
        datos = data
        drawHistogramPosEvaluated(data)
        
    });

    $.get("bars", {min:1,max:633,depth:getSelDepth(),player:getSelPlayer()} , function(data){
        bar_datos= data
        drawBarWinner(bar_datos)
    });

}



d3.select("#selDepth").on("change", drawHistogramPosEvaluated );
d3.select("#selPlayer").on("change", drawHistogramPosEvaluated )

//test();
init();


//drawBarWinner
