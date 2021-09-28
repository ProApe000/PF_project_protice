

//获取元素DOM节点
const rulesBtn=document.getElementById('rules-btn');
const closeBtn=document.getElementById('close-btn');
const rules=document.getElementById('rules');
const canvas=document.getElementById('canvas');
//ctx是js操作canvas画布的接口
const ctx=canvas.getContext('2d');


//定义ball paddle brick
const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    size:10,
    speed:4,
    dx:4,
    dy:-4,
    visible:true
}

const paddle={
    x:canvas.width/2-40,
    y:canvas.height-20,
    w:80,
    h:10,
    speed:8,
    dx:0,
    visible:true
}

const brickInfo={
    w:70,
    h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true,
}
let score=0;
const rowBricks=5;
const columnBricks=9;
const delay=500;

const bricks=[];
//create bricks
for(let i=0;i<rowBricks;++i){
    bricks[i]=[];
    for(let j=0;j<columnBricks;++j){
        let x=j*(brickInfo.w+brickInfo.padding)+brickInfo.offsetX;
        let y=i*(brickInfo.h+brickInfo.padding)+brickInfo.offsetY;
        bricks[i][j]={x,y,...brickInfo};
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
    ctx.fillStyle=ball.visible?'#0095dd':'transparent';
    ctx.fill();
    ctx.closePath();
}
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h);
    ctx.fillStyle=paddle.visible?'#0095dd':'transparent';
    ctx.fill();
    ctx.closePath();
}
function drawScore(){
    ctx.font='20px Arial';
    ctx.fillText(`Score: ${score}`,canvas.width-100,30);
}
function drawBricks(){
    bricks.forEach(row=>{
         row.forEach(brick=>{
             ctx.beginPath();
             ctx.rect(brick.x,brick.y,brick.w,brick.h);
             ctx.fillStyle=brick.visible?'#0095dd':'transparent';
             ctx.fill();
             ctx.closePath();
         })
    })
}

function movePaddle(){
    paddle.x+=paddle.dx;
    if(paddle.x+paddle.w>canvas.width){
        paddle.x=canvas.width-paddle.w;
    }
    if(paddle.x<0){
        paddle.x=0;
    }
    // console.log(paddle.x,paddle.y);
}

function moveBall(){
    ball.x+=ball.dx;
    ball.y+=ball.dy;
    //ball碰到上下左右边界的情况
    if(ball.x-ball.size<0||ball.x+ball.size>canvas.width){
        ball.dx*=-1;
    }
    if(ball.y-ball.size<0||ball.y+ball.size>canvas.height){
        ball.dy*=-1;
    }
    //ball碰到paddle的情况
    if(ball.x-ball.size>paddle.x&&ball.x+ball.size<paddle.x+paddle.w&&ball.y+ball.size>paddle.y){
        ball.dy=-ball.speed;
    }
    //ball碰到bricks的情况
    bricks.forEach(row=>{
        row.forEach(brick=>{
            if(brick.visible){
                //ball的上边小于brick的下边缘   ball的下边大于brick的上边缘
                if(ball.x-ball.size>brick.x&&ball.x+ball.size<brick.x+brick.w&&ball.y-ball.size<brick.y+brick.h&&ball.y+ball.size>brick.y){
                        ball.dy*=-1;
                        brick.visible=false;
                        increaseScore();
                }                
            }
        });
    });
    //ball碰到了下边界  score清0
    if(ball.y+ball.size>canvas.height){
        showAllBricks();
        score=0;
    }
}

function increaseScore(){
    ++score;
    if(score%(rowBricks*columnBricks)===0){
        ball.visible=false;
        paddle.visible=false;
        setTimeout(function(){
            showAllBricks();
            score=0;
            paddle.x=canvas.width/2-40;
            paddle.y=canvas.height-20;
            ball.x=canvas.width/2;
            ball.y=canvas.height/2;
            paddle.visible=true;
            ball.visible=true;
        },delay);
    }
}
function showAllBricks(){
    bricks.forEach(row=>{
        row.forEach(brick=>{
            brick.visible=true;
        })
    })
}
function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPaddle();
    drawBall();
    drawScore();
    drawBricks();
}
function keyDown(e){
    if(e.key==='Right'||e.key==='ArrowRight'){
        paddle.dx=paddle.speed;
    }
    else if(e.key==="Left"||e.key==='ArrowLeft'){
        paddle.dx=-paddle.speed;
    }
}
function keyUp(e){
    
    if(e.key==='Right'||e.key==='ArrowRight'||e.key==='Left'||e.key==='ArrowLeft'){
        paddle.dx=0;
    }
}

function update(){
    movePaddle();
    moveBall();

    draw();
    //清除某个矩形内的绘制的内容 相当于相当于橡皮擦
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // drawPaddle();
    //浏览器不断调用update函数 并且以一定的频率 
    requestAnimationFrame(update);
}
update();


document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
rulesBtn.addEventListener('click',()=>rules.classList.add('show'));
closeBtn.addEventListener('click',()=>rules.classList.remove('show'));

