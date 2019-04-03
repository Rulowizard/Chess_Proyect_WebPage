function initialize(){
    $.get("saved_games", function(data){
        console.log(data);

        for (i=0; i<data.length ; i++){
            //Agrego las secciones necesarias usando D3
            var paneles = d3.select("#paneles").append("div").attr("class","panel panel-default")
            var body = paneles.append("div").attr("class","panel-body")
                .attr("id","panel-body"+String(i))
            var rows = body.append("div").attr("class","row")

            //Sección para dibujar la imagen
            var cols1 = rows.append("div").attr("class","col-xs-5" )
            var divs = cols1.append("div").attr("id","svg"+ String(i) )
            //Convierto a objeto el string del svg
            img = $(data[i].svg);
            //Obtengo el div que va a guardar las imagenes svg
            var svg = document.getElementById("svg"+ String(i))
            //Limpio si ya tienen info
            svg.innerHTML="";
            //Agrego imagen SVG
            svg.appendChild(img[0]);

            //Escribir la info de texto
            var cols2 = rows.append("div").attr("class","col-xs-5")

            //Escribir H
            var h_text = cols2.append("h2").attr("class","h-paneles")
            h_text.text("Game Slot #"+ String(i+1) )

            //Escribir Ps
            var p1 = cols2.append("p").attr("class","p-label").text("FEN del juego:")
            var li1 = cols2.append("li").attr("class","p-li").text(data[i].fen)

            var p2 = cols2.append("p").attr("class","p-label").text("Próximo turno:")






        }
    });
}

initialize();



