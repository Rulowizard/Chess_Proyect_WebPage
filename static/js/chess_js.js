

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

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);