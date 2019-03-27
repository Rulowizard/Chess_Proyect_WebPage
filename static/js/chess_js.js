///////////////////////////////////////
//Javascript para pagina web test_svg//
///////////////////////////////////////

//Variables globales
//Color define a quien le toca mover. True es blanco
var color=true;
//Verdadero si no hay jaque mate o alguna condicion de mepate
var continuar = true;

//Arreglo que guardara los clicks del jugador humano
var clicks =[];


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

  if (player == "Humano"){




  } else{
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
}

//Regresa el valor de profundidad de la lista de seleccion para el jugador actual
//usa la variable global de color
function getSelDepth(){
  if (color==true){
    var sj = d3.select("#depth1")
  }else{
    var sj = d3.select("#depth2")
  }
  return sj.property("value");
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
    case "Humano":
      player="Humano"
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

//Proceso las coordenadas raw para convertirlas en
//string tipo UCI
function transformCoordinates(coord){
  x=coord[0];
  y=coord[1];

  //Click está dentro del rango permitido
  if(  (x>=20 && x<= 380) && ( y>=20 && y<=380 ) ){
    //Inicializo variables de salida
    var c1="" //X
    var c2="" //Y

    //Normalizo para quitar desfase
    x=x-20;
    y=y-20;

    //Obtengo el número del cuadrante del tablero
    cuadX = Math.ceil( x/45 );
    cuadY = Math.ceil( y/45 );
    console.log(cuadX);
    console.log(cuadY);

    //transformar cuadX a string
    switch(cuadX){
      case 1:
        c1="a";
        break;
      case 2:
        c1="b";
        break;
      case 3:
        c1="c";
        break;
      case 4:
        c1="d";
        break;
      case 5:
        c1="e";
        break;
      case 6:
        c1="f";
        break;
      case 7:
        c1="g";
        break;
      case 8:
        c1="h";
        break;
    }

    //transformar cuadY
    switch(cuadY){
      case 1:
        c2=8;
        break;
      case 2:
        c2=7;
        break;
      case 3:
        c2=6;
        break;
      case 4:
        c2=5;
        break;
      case 5:
        c2=4;
        break;
      case 6:
        c2=3;
        break;
      case 7:
        c2=2;
        break;
      case 8:
        c2=1;
        break;
    }

    resultado =c1+String(c2);
    console.log(resultado)


  } else{
    console.log("Nok");
  }
}



//Obtengo las coordenadas raw
function getCoordinates(){
  /*
  var coordX = d3.event.clientX;
  var coordY = d3.event.clientY;
  var offsetX = d3.event.offsetX;
  var offsetY = d3.event.offsetY;
  var screenX = d3.event.screenX;
  */
  var pageX = d3.event.pageX;
  var pageY = d3.event.pageY;

  d3.select("#coordx").text(pageX- this.offsetLeft )
  d3.select("#coordy").text(pageY- this.offsetTop)

  //LINEA DE PRUEBA
  transformCoordinates( [pageX-this.offsetLeft , pageY-this.offsetTop ]  );
}





async function game(){
  while (continuar==true){
    var tipo_jugador=getSelPlayer()
    var tipo_jug_serv = serverSelPlayer(tipo_jugador)
    var data = await getInfo(tipo_jug_serv, getSelDepth() )
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

d3.select("#svg").on("click",getCoordinates)