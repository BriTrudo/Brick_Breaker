
document.addEventListener('DOMContentLoaded', function () {
   var canvas = document.querySelector('#gameArea');
   var canvasCtx = canvas.getContext('2d');
   
   var titleScreenActive = true;
   var gameScreenActive = false;
   var gameOverScreenActive = false;
   
   var hasHitTop = true;
   var hasHitRight = false;
   var hasHitLeft = true;
   var hasHitBottom = false;
   
   var ballDirectionX = 450;
   var ballDirectionY = 375;
   var ballRadius = 10;
   var ballSpeed = 1;
   
   var level = 1;
   
   var score = 0;
   var lives = 3;
   
   
   var mousePos;
   var framesPerSec = 4;
   
   var draw;
   var drawBall;
   var drawPaddle;
   var drawBricks;
   var detectCollision;
   
   var paddleWidth = 75;
   var paddleHeight = 10;
   var paddleZone = 700;
   
   //brick variables
   
     var bricks = [];
   var brickRowCount = 3;
   var brickColumnCount = 10;
   var brickWidth = 75;
   var brickHeight = 20;
   var brickPadding = 10;
   var brickOffsetTop = 30;
   var brickOffsetLeft = 30;

   canvas.width = 900;
   canvas.height = 750;

   canvasCtx.fillStyle = '#000000';
   canvasCtx.fillRect(0,0,canvas.width, canvas.height);
   
   var titleText = new Image();
   var clickText = new Image();
   
   titleText.src = './BrickBreakerTitle.png';
   clickText.src = './Start.png';
   
   
   document.getElementById("gameArea").style.cursor = "none";
   
    getMousePos = function (event) {
         var rect, coordX, coordY;
         rect = canvas.getBoundingClientRect();
         coordX = event.clientX - rect.left;
         coordY = event.clientY - rect.top;
         return {
            x: Math.floor(coordX),
            y: Math.floor(coordY),
         };
      };
  
   drawTitleScreen();
      
   
   
   function drawTitleScreen (){
       titleText.onload = function(){
        canvasCtx.drawImage(titleText,198,150);
      }
      clickText.onload = function(){
        canvasCtx.drawImage(clickText,270,450);
      }
   }
   function drawGameOverScreen(){
      canvasCtx.fillStyle = "#000000";
      canvasCtx.fillRect(0,0,canvas.width, canvas.height);
   }
   
   
   canvas.addEventListener('click', function(){
      if (titleScreenActive || gameOverScreenActive){
         titleScreenActive = false;
         gameScreenActive = true;
         gameOverScreenActive = false;
         initializeGame();
      }
   }, false);
   
   document.addEventListener('mousemove', function(event){
      if (gameScreenActive){
         mousePos = getMousePos(event);
      }
   }, false);
   
   initializeGame = function(){
      bricks = [];
      canvasCtx.fillStyle = "#000000";
      canvasCtx.fillRect(0,0,canvas.width, canvas.height);
      ballDirectionX = 450;
      ballDirectionY = 375;
      hasHitTop = true;
      hasHitRight = false;
      hasHitLeft = true;
      hasHitBottom = false;
      
      if (level %2 === 0){
            brickRowCount++;
       }
      
    
      for(c = 0; c < brickColumnCount; c++) {
         bricks[c] = [];
         for(r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, active: 1, color: randomizeColor() };
    }
}
   };
   
   setInterval(function(){ 
      

      
      
      if (!gameOverScreenActive){
         if (titleScreenActive){
            drawTitleScreen;
         }
         
         
         
         if (gameScreenActive){
           
           checkForGameOver();
           
            if (ballDirectionX + ballRadius > canvas.width){
               hasHitRight = true;
               hasHitLeft = false;
            }
            
            if (ballDirectionX - ballRadius <= 0){
               hasHitRight = false;
               hasHitLeft = true;
            }
            
            if (ballDirectionY + ballRadius > paddleZone + paddleHeight){
               lives--;
                 ballDirectionX = 450;
               ballDirectionY = 375;
               hasHitTop = true;
               hasHitBottom = false;
             
               
            }
            
            if (ballDirectionY - ballRadius < 0){
               hasHitTop = true;
               hasHitBottom = false;
            }
      
            draw();

         
            
         }
       } else{
         drawGameOverScreen();
       }
     
      
   
   }, framesPerSec);
   
   
   draw = function(){
   
    
   
      canvasCtx.fillStyle = "#000000";
      canvasCtx.fillRect(0,0,canvas.width,canvas.height);
      drawScore();
      drawLives();
      drawBall();
      drawPaddle();
      drawBricks();
      detectCollision();
     
      
         if (hasHitBottom){
            ballDirectionY = ballDirectionY-ballSpeed;
         }
         
         if (hasHitLeft){
            ballDirectionX = ballDirectionX+ballSpeed;
         }
         
         if (hasHitTop){
            ballDirectionY = ballDirectionY+ballSpeed;
         }
         
         if (hasHitRight){
            ballDirectionX = ballDirectionX-ballSpeed;
         }

   };
   
   drawScore = function(){
        canvasCtx.font = "30px Arial";
        canvasCtx.fillStyle = "white";
        canvasCtx.fillText("Score: " + score,5,745);
   }
   
   drawLives = function(){
      canvasCtx.font = "30px Arial";
      canvasCtx.fillStyle = "white";
      canvasCtx.fillText("Lives: " + lives,720,745);
   }
   
   drawBall = function(){
      canvasCtx.beginPath();
      canvasCtx.fillStyle = "#ffffff";
      canvasCtx.arc(ballDirectionX,ballDirectionY, ballRadius, 0, 2 * Math.PI, false);
      canvasCtx.fill();
      canvasCtx.closePath();
   }

   
   drawPaddle = function(){
         canvasCtx.fillStyle = "#ffffff";
         canvasCtx.fillRect(mousePos.x, paddleZone, paddleWidth, paddleHeight);
   }
   
   drawBricks = function(){
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            
            if (bricks[c][r].active){
               canvasCtx.beginPath();
               canvasCtx.rect(brickX, brickY, brickWidth, brickHeight);
               canvasCtx.fillStyle = bricks[c][r].color;
               canvasCtx.fill();
               canvasCtx.closePath();
            }
        }
    }
   };
   
   detectCollision = function(){
      for( c = 0; c < brickColumnCount; c++){
         for( r = 0; r < brickRowCount; r++){
         
            var brickEdgeX = bricks[c][r].x + brickWidth;
            var brickEdgeY = bricks[c][r].y + brickHeight;
            
            for (var i = bricks[c][r].x; i <= brickEdgeX; i++){
               for (var j = bricks[c][r].y; j <= brickEdgeY; j++){
                  if (((ballDirectionX - ballRadius === i && ballDirectionY-ballRadius === j)|| (ballDirectionX + ballRadius === i && ballDirectionY+ballRadius === j)) && bricks[c][r].active){
                     bricks[c][r].active = 0;
                     score++;
                     hasHitTop = true;
                     hasHitBottom = false;
                  }
               }
            }
            
            for (var i = mousePos.x; i < mousePos.x + paddleWidth; i++){
               for (var j = mousePos.y; j < mousePos.y + paddleHeight; j++){
                  if ((ballDirectionX - ballRadius === i && ballDirectionY - ballRadius === paddleZone) || (ballDirectionX + ballRadius === i) && (ballDirectionY + ballRadius === paddleZone)){
                     hasHitTop = false;
                     hasHitBottom = true;
                  }
               }
            }
            
            
         }
      } 
   };
   
   checkForGameOver = function(){
   
      var brickCount = 0;
      
      level++;
      
      for( c = 0; c < brickColumnCount; c++){
         for( r = 0; r < brickRowCount; r++){
            if (bricks[c][r].active === 1){
               brickCount++;
            }
         }
      }
      
      
      
      if (brickCount === 0){
      
         
          ballSpeed+2;
         initializeGame();
        
      }
      
      if (lives === 0){
          score = 0;
          lives = 3;
         gameOverScreenActive = true;
      }
      
      
      
   }

   randomizeColor = function (){
		
    var r = Math.floor(Math.random() * (255 - 0)) + 50,
        g =  Math.floor(Math.random() * (255 - 0)) + 50,
        b =  Math.floor(Math.random() * (255 - 0)) + 50;
		
	return 'rgb(' + r + ',' + g + ',' + b + ')';

	};
   
   
 }());