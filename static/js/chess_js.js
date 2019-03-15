///////////////////////////////////////
//Javascript para pagina web test_svg//
///////////////////////////////////////

//Variables globales
//Color define a quien le toca mover. True es blanco
var color=true;
//Verdadero si no hay jaque mate o alguna condicion de mepate
var continuar = true;


//Inicializa en el lado del servidor un tablero nuevo
//No regresa el tablero pero si manda mensaje
function initialize(){
  color=true;
  continuar=true;

  $.get("initialize",function(data){
    console.log(data);
  });
}



//Regresa imagen SVG y valor si continua el juego
//Sólo para máquinas
//Recibe valor de la lista de seleccion del jugador actual y profundidad
async function getInfo(player,depth){
  var info="";
  info= await $.get("player",{player:player,depth:depth},function(data){
    //Data[0] viene info sobre la imagen SVG
    //Data[1] es la variable bool que indica si continua el juego
    
    //Convierte el string en objeto
    var obj_svg=$(data[0])
    //Acceder a la info de la imagen
    var img_svg=obj_svg[0]

    return {cont:data[1],img:data[0]};
  });

  return info;
}

//Regresa el valor de la lista de seleccion para el jugador actual
//usa la variable global de color
function getSelPlayer(){
  if (color==true){
    var sj = d3.select("#selPlayer1");
  } else{
    var sj = d3.select("#selPlayer2");
  }
  return sj.property("value");
}

//Regresa la equivalencia del lado del servidor del valor de la lista de seleccion
function serverSelPlayer(selValue){

  switch(selValue){
    case "Maquina 1":
      player="M1"
      break;
    case "Maquina 2":
      player="M2"
      break;
    case "Maquina 3":
      player="M3"
      break;
    case "Maquina 4":
      player="M4"
      break;
    default:
      player="M5"
  }

  return player;

}

//Dibujar una imagen SVG en la página web
function dibujarSVG(img){
  new_svg = $(img)
  var svg = document.getElementById("svg");
  svg.innerHTML="";
  svg.appendChild(new_svg[0]);
}



async function game(){
  while (continuar==true){
    var tipo_jugador=getSelPlayer()
    var tipo_jug_serv = serverSelPlayer(tipo_jugador)
    var data = await getInfo(tipo_jug_serv,0)
    dibujarSVG(data[0]);
    continuar = data[1];
    color = !color;
  }
}


//Obtener tablero SVG actual
// Submit Button handler
function handleSubmit() {
    
  console.log("handleSubmit");

  $.get("game",function(data){
    console.log( typeof data );
    console.log(data);

    var new_svg = $(data);
    console.log(typeof new_svg);
    console.log(new_svg[0]);
    
    var svg = document.getElementById("svg");
    svg.innerHTML="";
    svg.appendChild(new_svg[0]);
    turno ="W";
  });


}


function handlePlay(){
  console.log("handlePlay");
  var cont = new Boolean(true);
  var new_svg ="";
  var svg = "";
  var ciclo=0;

  var sj1 = d3.select("#selPlayer1");
  var sj2 = d3.select("#selPlayer2");

  var j1 = sj1.property("value");
  var j2 = sj2.property("value");

  console.log(j1);
  console.log(j2);


  var depth=0;
  var player;

  if (turno=="W") {
    
    switch(j1){
      case "Maquina 1":
        player="M1"
        break;
      case "Maquina 2":
        player="M2"
        break;
      case "Maquina 3":
        player="M3"
        break;
      case "Maquina 4":
        player="M4"
        break;
      default:
        player="M5"
    }
    console.log(player)
    

    $.get("player",{player: player, depth:0},function(data){
      cont = data[1];
      new_svg = $(data[0]);
      svg = document.getElementById("svg");
      svg.innerHTML="";
      svg.appendChild(new_svg[0]);
    });

    turno="B";

  }else{

    switch(j2){
      case "Maquina 1":
        player="M1"
        break;
      case "Maquina 2":
        player="M2"
        break;
      case "Maquina 3":
        player="M3"
        break;
      case "Maquina 4":
        player="M4"
        break;
      default:
        player="M5"
    }
    console.log(player)

    $.get("player",{player: player, depth:0},function(data){
      cont = data[1];
      new_svg = $(data[0]);
      svg = document.getElementById("svg");
      svg.innerHTML="";
      svg.appendChild(new_svg[0]);
    });

    turno="W"

  }

}





initialize();

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);

//Add event listener for submit button
d3.select("#play").on("click", handlePlay);

//Add event listener for submit button
d3.select("#game").on("click", game);

d3.select("#restart").on("click", initialize);