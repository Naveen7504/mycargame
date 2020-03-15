
var score = 0;
var scoreinterval;
var speedInterval;
var audoInterval;
var animationFrame;
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var carLengthRemover = 0;
var carHeight = 52 - carLengthRemover - carLengthRemover;
var carWidth = 26 - carLengthRemover - carLengthRemover;
var control = "normal";
var controlType = "gesture";
var laneCount = [0,0,0,0];
var highScore;
$(document).ready(function(){
  highScore = localStorage.getItem("mycargame_highscore") ? localStorage.getItem("mycargame_highscore") : 0;
  $('.highscore').html("High Score : "+highScore);
  $('.leftcontrol').hide();
  $('.rightcontrol').hide();
  console.log(highScore);
  pauseEveryting();
  $('#play').on('click', startGame);
  $(document).on('keydown', playPauseOnSpaceKey);
  $('#control-gesture').on('click',function() {
    controlType = "gesture";
    $('#control-gesture').addClass('active');
    $('#control-button').removeClass('active');
    $('.leftcontrol').hide();
    $('.rightcontrol').hide();
  });
  $('#control-button').on('click',function() {
    controlType = "button";
    $('#control-button').addClass('active');
    $('#control-gesture').removeClass('active');
    $('.leftcontrol').show();
    $('.rightcontrol').show();
  });
});

function playPauseOnSpaceKey(event) {
  if(event.originalEvent.key == " "){
    startGame();
  }
}

function startGame(){
  console.log("game started");
  console.log("control Type",controlType);
  console.log("speed type",control);
  $('.play-modal').hide();
  $(document).off('keydown', playPauseOnSpaceKey);
  score = 0;
  scoreinterval = setInterval(scoreIncrementer,100);
  $('.car').css('left',50);
  removeCarControls();
  removeCarControlsGesture();
  if(controlType == "button"){
    addCarControls();
  }else{
    addCarControlsGesture();
  }
  animationFrame = requestAnimationFrame(collisionDetection);
  startOppCarAnimation();
}

function stopAnimationFrame() {
  // console.log('stop on play model');
  setTimeout(function(){
    // console.log('stop on play model');
    cancelAnimationFrame(animationFrame);
  },100);
}

function scoreIncrementer() {
  score++;
  document.querySelector('.score').innerHTML = "Score "+score;
}

function collisionDetection(){
  var oppcars = document.querySelectorAll('.caropp');
  var mycar = document.querySelector('.car');
  oppcars.forEach(function(car) {
      var cartop = car.offsetTop + carLengthRemover;
      var carbottom = cartop + carHeight;
      var carleft = car.offsetLeft + carLengthRemover;
      var carright = carleft + carWidth;
      var mycartop = mycar.offsetTop + carLengthRemover;
      var mycarbottom = mycartop + carHeight;
      var mycarleft = mycar.offsetLeft + carLengthRemover;
      var mycarright = mycarleft + carWidth;

      if( ((cartop >= mycartop && cartop <= mycarbottom) ||
          (carbottom >= mycartop && carbottom <= mycarbottom)) &&
          ((carleft >= mycarleft && carleft <= mycarright) ||
          (carright >= mycarleft && carright <= mycarright)) ){
            stopAnimationFrame();
            // console.log("stopping animationFrame");
        pauseEveryting();
        clearInterval(scoreinterval);
        clearInterval(speedInterval);
        $('.play-modal').show();
        var score = $('.score').html();
        if(parseInt(score.replace("Score ","")) > highScore){
          localStorage.setItem("mycargame_highscore", parseInt(score.replace("Score ","")));
          highScore = localStorage.getItem("mycargame_highscore");
        }
        var playscore = "<div> Restart </div><div>Your "+score+"</div><div>High Score: "+highScore+"</div>";
        $('.play-text').html(playscore);
        $('.highscore').html("High Score : "+highScore);
        console.log(highScore);
      }
  });
  animationFrame = window.requestAnimationFrame(collisionDetection);
}

function addCarControls() {
  $(document).on('keydown',controlcar);
  $('.leftcontrol').on('click',moveLeft);
  $('.rightcontrol').on('click',moveRight);
}
function removeCarControls() {
  $(document).off('keydown',controlcar);
  $('.leftcontrol').off('click',moveLeft);
  $('.rightcontrol').off('click',moveRight);
}
function addCarControlsGesture() {
  $(document).on('keydown',controlcar);
  $(document).on('click',gesture);
}
function removeCarControlsGesture() {
  $(document).off('keydown',controlcar);
  $(document).off('click',gesture);
}

function gesture(event) {
  console.log(event);
  var element = document.querySelector('.car');
  if(event.originalEvent.x < (window.innerWidth/2)){
    //move left
    if(element.offsetLeft > 10){
      $(document).off('keydown',controlcar);
        $(document).off('click',gesture);
        $(element).animate({left:"-=45"},100,"swing",addCarControlsGesture);
    }

  }else{
    //move right
    if(element.offsetLeft < 140){
      $(document).off('keydown',controlcar);
        $(document).off('click',gesture);
        $(element).animate({left:"+=45"},100,"swing",addCarControlsGesture);
    }

  }
}

function moveRight(element){
  element = document.querySelector('.car');
  if(element.offsetLeft < 140){
    if(control == "fast"){
      $(element).css({left:"+=45"});
    }else{
      $(document).off('keydown',controlcar);
      $('.leftcontrol').off('click',moveLeft);
      $('.rightcontrol').off('click',moveRight);
        $(element).animate({left:"+=45"},100,"swing",addCarControls);
    }
  }
}
function moveLeft(element){
  element = document.querySelector('.car');
  if(element.offsetLeft > 10){
    if(control == "fast"){
      $(element).css({left:"-=45"});
    }else{
      $(document).off('keydown',controlcar);
      $('.leftcontrol').off('click',moveLeft);
      $('.rightcontrol').off('click',moveRight);
        $(element).animate({left:"-=45"},100,"swing",addCarControls);
    }
  }
}

function pauseEveryting() {
  document.querySelectorAll('.tree').forEach(function(tree) {
      tree.style.animationPlayState = "paused";
  });
  document.querySelectorAll('.caropp').forEach(function(car) {
      $(car).stop(true);
  });
  removeCarControls();
  removeCarControlsGesture();
}

function controlcar(event){
  // console.log(event.originalEvent.key, event.type);
  if(event.originalEvent.key && event.originalEvent.key == "ArrowLeft"){
      moveLeft();
  }
  if(event.originalEvent.key && event.originalEvent.key == "ArrowRight"){
     moveRight();
  }
}

function startOppCarAnimation(){
  var delay = 2000;
  var odd = true;
  var speed = 4500;
  laneCount = [0,0,0,0];
  document.querySelectorAll('.caropp').forEach(function(caropp){
    // choosing random lane for car.
    var lane = getRndInteger(0,3);
    lane = balanceRandomLane(lane);
    var left = (lane*45)+5;
    laneCount[lane]++;
    $(caropp).css("left",left+"px");
    $(caropp).css("top","-200px");
    $(caropp).stop().delay(delay).animate({top:"1600px"},speed,"linear",callCarAnimation);
    $(caropp).attr("speed",speed);
    $(caropp).attr("change",1);
    delay += 405;
  });
}
function callCarAnimation(event){
  // console.log("recall",this);
  var speed = $(this).attr("speed");
  // Increasing car speed
  if(speed > 500){
    var change = $(this).attr("change");
    $(this).attr("change",parseInt(change)+1);
    if(change > 5){
      speed -= 40;
    }else{
        speed -= 300;
    }
  }
  // choosing random lane for car.
  var lane = getRndInteger(0,3);
  lane = balanceRandomLane(lane);
  var left = (lane*45)+5;
  laneCount[lane]++;
  $(this).css("left",left+"px");
  $(this).attr("speed",speed);
  $(this).css("top","-200px");
  $(this).animate({top:"1200px"},speed,"linear",callCarAnimation);
}

function balanceRandomLane(lane) {
  var frequentLane = false;
  // console.log("lane ",lane);
  for(var i=0;i<laneCount.length;i++){
    // console.log("absolute: ",Math.abs(laneCount[i] - laneCount[lane]));
    if(lane == i){
      continue;
    }
    if(Math.abs(laneCount[i] - laneCount[lane]) > 1){
      frequentLane = true;
      break;
    }
  }
  if(!frequentLane){
    return lane;
  }
  // console.log(laneCount);
  lane = 0;
  var min = laneCount[lane];
  for(var i=0;i<laneCount.length;i++){
    if(laneCount[i] < min){
      min = laneCount[i];
      lane = i;
    }
  }
  return lane;
}

// always returns a random number between min and max (both included):
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
