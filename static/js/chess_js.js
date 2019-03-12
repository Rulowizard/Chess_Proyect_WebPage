///////////////////////////////////////
//Javascript para pagina web test_svg//
///////////////////////////////////////

//Variables globales
var turno=""


//Request server to initialize a game (create a new chess board)
function initialize(){
  $.get("initialize",function(data){
    console.log(data)
    turno="W"
  });
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
    

    $.get("player",{data:[player,0]},function(data){
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

    $.get("player",{data:[player,0]},function(data){
      cont = data[1];
      new_svg = $(data[0]);
      svg = document.getElementById("svg");
      svg.innerHTML="";
      svg.appendChild(new_svg[0]);
    });

    turno="W"

  }



    //Juega jugador v4 vs v4
    /*
    $.get("play",function(data){
      cont = data[1];

      new_svg = $(data[0]);
      svg = document.getElementById("svg");
      svg.innerHTML="";
      svg.appendChild(new_svg[0]);
    })  
    */

  



}





initialize();

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);

//Add event listener for submit button
d3.select("#play").on("click", handlePlay);