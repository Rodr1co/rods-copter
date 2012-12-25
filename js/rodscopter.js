
function Init(){
document.body.addEventListener('touchmove',function(e){e.preventDefault()},false);
}

window.onload=function(){
Init();
document.getElementById('playgame').addEventListener("click",function(e){PlayGame();},false);
document.getElementById('playgame').addEventListener("touchstart",function(e){PlayGame();},false);
}

function PlayGame(){

document.getElementById('playgame').style.display='none';

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var n = ctx;

canvas.width=480;
canvas.height=320;

var myKey={};

addEventListener("mousedown",function(e){myKey[-1]=true;reset();},false);
addEventListener("mouseup",function(e){delete myKey[-1];reset();},false);
addEventListener("touchstart",function(e){myKey[-1]=true;reset();},false);
addEventListener("touchend",function(e){delete myKey[-1];reset();},false);

document.getElementById('resumeplay').addEventListener("click",function(e){resumePlay();},false);
document.getElementById('resumeplay').addEventListener("touchstart",function(e){resumePlay();},false);

document.getElementById('playagain').addEventListener("click",function(e){playAgain();},false);
document.getElementById('playagain').addEventListener("touchstart",function(e){playAgain();},false);

var counter=0, 
counter2=0, 
speed=200, 
startspeed=speed, 
distance=0, 
cycle=0, 
phase, 
hit=0, 
explosion=0, 
points = 0, 
starcode=0, 
accel=speed/1000, 
targets=0, 
addtarget=0, 
lives=3, 
takelife = 0;

if(!localStorage)
copterhighscore=0;

if(localStorage){
copterhighscore = localStorage.getItem('copterhighscore');
if(copterhighscore == null || copterhighscore == '' || copterhighscore < 1)
copterhighscore=0;
}

if(accel < 0.1) accel = 0.1;

// copter center
var ccX, ccY;

// block centers
var b1X, b1Y, b2X, b2Y, b3X, b3Y;

var invincible = false;

// proximity
var c2b1x = 100; // copter center to block 1 center : X-axis
var c2b1y = 100; // copter center to block 1 center : Y-axis
var c2b2x = 100; // copter center to block 2 center : X-axis
var c2b2y = 100; // copter center to block 2 center : Y-axis
var c2b3x = 100; // copter center to block 3 center : X-axis
var c2b3y = 100; // copter center to block 3 center : Y-axis
var starX = 1000; // center of star : X-axis
var starY = 1000; // center of star : Y-axis
var c2starX = 1000; // copter center to center of star : X-axis
var c2starY = 1000; // copter center to center of star : Y-axis

var bg=new Image();
bg.src="images/mountains.png";

var block=new Image();
block.src="images/block.png";

var copter=new Image();
copter.src="images/copter.png";

var copter2=new Image();
copter2.src="images/invincible.png";

var exp1=new Image();
exp1.src="images/explode1.png";

var exp2=new Image();
exp2.src="images/explode2.png";

var exp3=new Image();
exp3.src="images/explode3.png";

var exp4=new Image();
exp4.src="images/explode4.png";

var exp5=new Image();
exp5.src="images/explode5.png";

var star=new Image();
star.src="images/greenstar.png";

var bg1={x:0,y:0};
var bg2={x:canvas.width,y:0};

var block1={x:canvas.width*1.5,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
var block2={x:canvas.width*2.0,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
var block3={x:canvas.width*2.5,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};

// cp = copter parameters
var cp={sx:0,sy:0,swidth:50,sheight:36,x:215,y:142,width:50,height:36};

var vel={y:0}
var maxvel = Math.round(speed/50);
var reset=function(){ vel.y = 0; };

var drawBG=function(){
bg1.x-=speed/100;
if(bg1.x <= -canvas.width){ bg1.x = 0; }
bg2.x = bg1.x + canvas.width;
ctx.drawImage(bg,bg1.x,0);
ctx.drawImage(bg,bg2.x,0);
};

var drawBlocks=function(){
block1.x-=speed/100;
block2.x-=speed/100;
block3.x-=speed/100;
if(block1.x <= -block.width){ block1.x += canvas.width*1.5; block1.y = Math.round(32+(Math.random()*(canvas.height-78*2))); starcode++; starX = 1000; starY = 1000; }
if(block2.x <= -block.width){ block2.x += canvas.width*1.5; block2.y = Math.round(32+(Math.random()*(canvas.height-78*2))); }
if(block3.x <= -block.width){ block3.x += canvas.width*1.5; block3.y = Math.round(32+(Math.random()*(canvas.height-78*2))); }
ctx.drawImage(block,block1.x,block1.y);
ctx.drawImage(block,block2.x,block2.y);
ctx.drawImage(block,block3.x,block3.y);

if(starcode%2 == 0 && starcode > 0 && !invincible){
if(block1.y > 121){ 
ctx.drawImage(star,block1.x,block1.y - 40);
starY = block1.y - 23; 
}
else { 
ctx.drawImage(star,block1.x,block1.y + 80);
starY = block1.y + 97; 
}
starX = block1.x; 
}

};

var drawCopter=function(){
cycle++;
accel = speed/1000;
if(accel<0.1) accel=0.1;

// if hit then stop up-down movement
if(hit==0){
vel.y += accel; // ease into up-down movement
if(vel.y >= maxvel)
vel.y = maxvel;
if(-1 in myKey) { cp.y-=vel.y; cp.sy = 36; }
else { cp.y+=vel.y; cp.sy = 0; }
// cp.sy animates copter pitch
}

// keep copter from flying off screen when invincible
if(cp.y >= 262) cp.y = 262; 
if(cp.y <= 22) cp.y = 22;

// animate the copter 
// cp.sx animates copter rotor blades
if(cycle >= 10) cycle = 0;
if(cycle >= 0 && cycle <= 5) phase = 1;
else phase = 2;
if(phase == 1) cp.sx = 0;
else cp.sx = 50;
if(hit==0){
if(invincible)
ctx.drawImage(copter2,cp.sx,cp.sy,cp.swidth,cp.sheight,cp.x,cp.y,cp.width,cp.height);
else
ctx.drawImage(copter,cp.sx,cp.sy,cp.swidth,cp.sheight,cp.x,cp.y,cp.width,cp.height);
}

else {
// animate the explosion
explosion++;
if(explosion < 10)
ctx.drawImage(exp1,cp.x,cp.y);
if(explosion>=10 && explosion<20)
ctx.drawImage(exp2,cp.x,cp.y);
if(explosion>=20 && explosion<30)
ctx.drawImage(exp3,cp.x,cp.y);
if(explosion>=30 && explosion<40)
ctx.drawImage(exp4,cp.x,cp.y);
if(explosion>=40 && explosion<50)
ctx.drawImage(exp5,cp.x,cp.y);
}

};

var hitTest=function(){
// find center of copter and blocks
ccX = cp.x + (cp.width/2);
ccY = cp.y + (cp.height/2);
b1X = block1.x + (block.width/2);
b1Y = block1.y + (block.height/2);
b2X = block2.x + (block.width/2);
b2Y = block2.y + (block.height/2);
b3X = block3.x + (block.width/2);
b3Y = block3.y + (block.height/2);

c2starX = Math.round(ccX - starX);
if(c2starX < 0) c2starX = c2starX*-1;
c2starY = Math.round(ccY - starY);
if(c2starY < 0) c2starY = c2starY*-1;
if(c2starX < 40 && c2starY < 40 && starX < 1000 && starY < 1000){
invincible=true;
if(addtarget == 0){ targets++; addtarget = 1;  }
setTimeout(function(){ invincible=false; addtarget=0;},6000);
}

if(!invincible){
// check if copter hits a block
c2b1x = Math.round(ccX - b1X);
if(c2b1x < 0) c2b1x = c2b1x*-1;
c2b1y = Math.round(ccY - b1Y);
if(c2b1y < 0) c2b1y = c2b1y*-1;
if(c2b1x < 41 && c2b1y < 57){hit=1;}

c2b2x = Math.round(ccX - b2X);
if(c2b2x < 0) c2b2x = c2b2x*-1;
c2b2y = Math.round(ccY - b2Y);
if(c2b2y < 0) c2b2y = c2b2y*-1;
if(c2b2x < 41 && c2b2y < 57){hit=1;}

c2b3x = Math.round(ccX - b3X);
if(c2b3x < 0) c2b3x = c2b3x*-1;
c2b3y = Math.round(ccY - b3Y);
if(c2b3y < 0) c2b3y = c2b3y*-1;
if(c2b3x < 41 && c2b3y < 57){hit=1;}

// check if copter hits floor or ceiling
if(cp.y < 28){hit=1;}
if(cp.y > 256){hit=1;}
}

// stop scrolling if copter hits something
if(hit > 0){
speed=0;
if(takelife==0){
lives--;
takelife=1;
}
if(lives > 0){
document.getElementById('resumeplay').style.display='inline-block';
}
else {
document.getElementById('playagain').style.display='inline-block';
if(localStorage){
localStorage.getItem('copterhighscore');
if(points > copterhighscore)
localStorage.setItem('copterhighscore', points);
copterhighscore = localStorage.getItem('copterhighscore');
}
}
}

}

var resumePlay=function(){
// reset some parameters
hit=0;
takelife=0;
speed = startspeed + Math.round(points/40);
explosion=0;
cycle=0;
bg1={x:0,y:0};
bg2={x:canvas.width,y:0};
block1={x:canvas.width*1.5,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
block2={x:canvas.width*2.0,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
block3={x:canvas.width*2.5,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
cp.y=142;
document.getElementById('playagain').style.display='none';
document.getElementById('resumeplay').style.display='none';
}

var playAgain=function(){
// reset some parameters
points=0;
counter=0;
counter2=0;
hit=0;
takelife=0;
lives=3;
starcode=0;
targets=0;
speed = startspeed + Math.round(points/40);
explosion=0;
cycle=0;
bg1={x:0,y:0};
bg2={x:canvas.width,y:0};
block1={x:canvas.width*1.5,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
block2={x:canvas.width*2.0,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
block3={x:canvas.width*2.5,y:Math.round(32+(Math.random()*(canvas.height-78*2)))};
cp.y=142;
document.getElementById('playagain').style.display='none';
document.getElementById('resumeplay').style.display='none';
}

var gameLoop=function(){
counter++;
if(hit==0){
counter2++;
speed = startspeed + Math.round(points/40);
}
distance=Math.round(counter2/100);
points = (Math.round(counter2/4)) + (targets*100);
maxvel = 1 + (speed/100);
drawBG();
drawBlocks();
drawCopter();
hitTest();
trackData();
game=setTimeout(gameLoop,20);
};

var trackData=function(){

n.fillStyle="#000000";
n.font="16px Arial";
n.textAlign="left";
n.textBaseline="top";
n.fillText("SCORE: "+points,11,33);
n.fillStyle="#eeeeff";
n.font="16px Arial";
n.textAlign="left";
n.textBaseline="top";
n.fillText("SCORE: "+points,10,32);

n.fillStyle="#000000";
n.font="16px Arial";
n.textAlign="right";
n.textBaseline="top";
n.fillText("LIVES: "+lives,471,33);
n.fillStyle="#eeeeff";
n.font="16px Arial";
n.textAlign="right";
n.textBaseline="top";
n.fillText("LIVES: "+lives,470,32);

n.fillStyle="#000000";
n.font="16px Arial";
n.textAlign="left";
n.textBaseline="top";
n.fillText("SPEED: "+speed+" KTS",11,271);
n.fillStyle="#eeeeff";
n.font="16px Arial";
n.textAlign="left";
n.textBaseline="top";
n.fillText("SPEED: "+speed+" KTS",10,270);

n.fillStyle="#000000";
n.font="16px Arial";
n.textAlign="right";
n.textBaseline="top";
n.fillText("HIGH SCORE: "+copterhighscore,471,271);
n.fillStyle="#eeeeff";
n.font="16px Arial";
n.textAlign="right";
n.textBaseline="top";
n.fillText("HIGH SCORE: "+copterhighscore,470,270);
}
gameLoop();
}
