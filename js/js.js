function start() { 

    // Ocultar
	$("#inicio").hide();
	
    // Criar as DIVS
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo
	var jogo = {}
    // Teclas pressionadas
	var TECLA = {
            C: 38, //Cimas
            B: 40, //Baixoo
            A: 32 //Atira
        }
    // Inimigo 1
    var velocidade = 8;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;

    var fimdejogo = false;

    // Placar
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;

    // Energia
    var energiaAtual = 3;

    jogo.pressionou = [];

    // Variáveis dos sons
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se o usuário pressionou alguma tecla	
    // keydown = verifica que pressionou uma tecla
    $(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
    });
    
    // keyup = verifica que não tem tecla pressionada
    $(document).keyup(function(e){
        jogo.pressionou[e.which] = false;
    });
	
	//Game Loop. setInterval = temporizador. 30 milisegundos
	jogo.timer = setInterval(loop,30);
	
	function loop() {
	    movefundo();
        movejogador();
        moveinimigo1();
        moveinimigo2();
        moveamigo();
        colisao();
        placar();
        energia();
	} 

//Função que movimenta o fundo do jogo
	
	function movefundo() {
        // Valor atual do fundo da div (fundoGame)
        esquerda = parseInt($("#fundoGame").css("background-position"));
        // Atualizando a posicao atual (0 - 1)
        $("#fundoGame").css("background-position",esquerda - 1);
	} 
    
	function movejogador() {
	
        if (jogo.pressionou[TECLA.C]) {
            // pega o valor CSS da DIV jogador TOP
            var topo = parseInt($("#jogador").css("top"));
            // Para Cima
            $("#jogador").css("top",topo-10);
            
            if (topo<=0) {
                $("#jogador").css("top",topo+10);
            }
        }
    
        if (jogo.pressionou[TECLA.B]) {
            var topo = parseInt($("#jogador").css("top"));
            // Para baixo
            $("#jogador").css("top",topo+10);	

            if (topo>=434) {	
                $("#jogador").css("top",topo-10);
            }
        }
        
        if (jogo.pressionou[TECLA.A]) {
            disparo();	
        }
    }     

    function moveinimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",posicaoX - velocidade);
        $("#inimigo1").css("top",posicaoY);
            
        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            // 694 = direita
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);  
        }
    } 

    function moveinimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
	    $("#inimigo2").css("left",posicaoX - 4);
				
		if (posicaoX <= 0) {
		    $("#inimigo2").css("left",775);
		}
    }

    function moveamigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",posicaoX+1);
				
        if (posicaoX > 906) {
            $("#amigo").css("left",0);		
        }
    }

    function disparo() {
	
        if (podeAtirar == true) {
            somPerdido.play();
            // Para nao realizar um novo tiro enquanto a funcao estiver em execuçao
            podeAtirar = false;
        
            // Posoiçao do jogador
            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            // Onde sairá o tiro
            tiroX = posicaoX + 190;
            topoTiro = topo + 37;
            // DIV disparo
            $("#fundoGame").append("<div id='disparo'></div");
            // Posiçao da DIV
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            // Tempo
            var tempoDisparo = window.setInterval(executaDisparo, 30);
        } 
     
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left",posicaoX + 15); 
    
            if (posicaoX > 900) {
                // Remover a variável
                window.clearInterval(tempoDisparo);
                // Zera a variável
                tempoDisparo = null;
                // Remover da tela
                $("#disparo").remove();
                // Pode disparar
                podeAtirar = true;
            }
        } 
    } 

    function colisao() {
        // Colisão entre o jogador e o inimigo1...
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        // jogador com o inimigo1
        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X,inimigo1Y);
        
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        // jogador com o inimigo2 
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X,inimigo2Y);
            // Remove o inimigo
            $("#inimigo2").remove();
            // O inimigo reaparece
            reposicionaInimigo2();
        }	
        
        // Disparo com o inimigo1
        if (colisao3.length > 0) {
            // Aumenta a velocidade
            velocidade = velocidade + 0.3;
            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
                
            explosao1(inimigo1X,inimigo1Y);
            // Reposicionar o disparo. 
            $("#disparo").css("left",950);
            
            // Reposicionar o inimigo
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
        }

        // Disparo com o inimigo2
        if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
        
            explosao2(inimigo2X,inimigo2Y);
            $("#disparo").css("left",950);
            
            reposicionaInimigo2();
        }

        // jogador com o amigo
	    if (colisao5.length > 0) {
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Inimigo2 com o amigo
        if (colisao6.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();
        }
    }

    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");

        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        // Vai crescer ate 200, e vai ate a opacidade 0, devagar
        div.animate({width:200, opacity:0}, "slow");
        
        // Remover apos 1s
        var tempoExplosao = window.setInterval(removeExplosao, 1000);
        
            function removeExplosao() {
                div.remove();
                // Removendo
                window.clearInterval(tempoExplosao);
                // Zerando
                tempoExplosao = null;
            }
    }

    function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        
        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        // Remover apos 1s
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
        function removeExplosao2() {
            div2.remove();
            // Removendo
            window.clearInterval(tempoExplosao2);
            // Zerando
            tempoExplosao2 = null;
        }   
    }

    function explosao3(amigoX,amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);

        // Remover apos 1s
        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);
        function resetaExplosao3() {
            $("#explosao3").remove();
            // Removendo
            window.clearInterval(tempoExplosao3);
            // Zerando
            tempoExplosao3 = null;
        }
    }

	function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }

    function reposicionaInimigo2() {
        // Vai dar um tempo de 5s
        var tempoColisao4 = window.setInterval(reposiciona4, 5000);
            
        function reposiciona4() {
            // Remover
            window.clearInterval(tempoColisao4);
            // Zerar
            tempoColisao4 = null;
                
            if (fimdejogo == false) {
                $("#fundoGame").append("<div id=inimigo2></div");
            }
                
        }	
    }

    function placar() {
        // Atualizar a DIV placar
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    function energia() {
        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(imgs/energia0.png)");
            gameOver();
        }
    }

	function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();
        
        // Parar o timer do jogo
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>");
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
    }
}

function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}
