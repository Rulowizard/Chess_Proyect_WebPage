
//Request server to initialize a game (create a new chess board)
function initialize(){
  $.get("initialize",function(data){
    console.log(data)
  });
}

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
    svg.appendChild(new_svg[0]);
  });
}

function handlePlay(){
  console.log("handlePlay");
  var cont = new Boolean(true);


  while (cont){
    $.get("play",function(data){
      console.log(data);
      cont = data[1];
      var new_svg = $(data[0]);
      var svg = document.getElementById("svg");
      svg.innerHTML="";
      svg.appendChild(new_svg[0]);



    });
  }
}





initialize();

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);

//Add event listener for submit button
d3.select("#play").on("click", handlePlay);