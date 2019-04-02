//Variable global
lista_link=""

function initialize(){
    $.get("scrape",function(data){

        console.log(data)

        //Extraigo la info de las fuentes de las imagenes
        lista_src=data[2];
        //Extraigo texto noticia
        lista_texto=data[1]
        //Extraigo
        lista_link=data[0]

        //Actualizo la src de las imagenes
        document.getElementById("img1").src=lista_src[0];
        document.getElementById("img2").src=lista_src[1];
        document.getElementById("img3").src=lista_src[2];
        document.getElementById("img4").src=lista_src[3];
        document.getElementById("img5").src=lista_src[4];
        document.getElementById("img6").src=lista_src[5];

        //Actualizo caption de las imagenes
        d3.select("#c1").text(lista_texto[0]);
        d3.select("#c2").text(lista_texto[1]);
        d3.select("#c3").text(lista_texto[2]);
        d3.select("#c4").text(lista_texto[3]);
        d3.select("#c5").text(lista_texto[4]);
        d3.select("#c6").text(lista_texto[5]);

        //Actualizo onClick
        d3.select("#c1").attr("href", lista_link[0] )
        d3.select("#c2").attr("href", lista_link[1] )
        d3.select("#c3").attr("href", lista_link[2] )
        d3.select("#c4").attr("href", lista_link[3] )
        d3.select("#c5").attr("href", lista_link[4] )
        d3.select("#c6").attr("href", lista_link[5] )

    });
}



//Lleno la pagina principal con informacion
initialize();






























        /*
        //Selecciono el elemento que contiene los indicadores del carrusel
        carousel_ind = d3.select("#carousel-ind")
        carousel_sld = d3.select("#carousel-slides")
        for ( i=0 ; i< lista_src.length;i++ ){
            var li = carousel_ind.append("li")
            if (i==0){
                li.attr("data-target","#myCarousel")
                    .attr("data-slide-to",i)
                    .attr("class","active" )
            }else{
                li.attr("data-target","#myCarousel")
                .attr("data-slide-to",i)
            }
            var item = carousel_sld.append("div").attr("class", (i==0) ? "item active" :"item" )
            var img = item.append("img")
            img.attr("src",lista_src[i])
        }
        */