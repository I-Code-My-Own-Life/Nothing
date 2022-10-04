// All of our scenes are here : 
const LOADING = 0;
const MENU = 1;
const GAME = 2;
const LEADERBOARD = 3;
const GAMEOVER = 4;
// Our current scene or default scene will be 0 (loading scene) :  
let currentScene = 0;
// Our fonts variables are here : 
let font1;
let font2_bold;
// All of our Music variables are here :
let backgroundMusic;
let backgroundMusic1;
let fire;
let hit;
let startMusic = false;
// All of our image variables : 
let enemyImg;
let shipImg;
let bulletImg;
let data;
function preload(){
    font1 = loadFont("Fonts/font1.ttf");
    font2_bold = loadFont("Fonts/font2-bold.ttf")
    backgroundMusic = loadSound("Music/background2.mp3");
    backgroundMusic1 = loadSound("Music/background.ogg")
    fire = loadSound("../Music/fire.ogg");
    hit = loadSound("../Music/hit.ogg");
    // 1st Sprite : 
    shipImg = loadImage("Assets/ship.png");
    // 2nd Sprite : 
    bulletImg = loadImage('Assets/bullet.png');
    // Third Sprite : 
    enemyImg = loadImage("Assets/enemy.png");
    // Loading our JSON file here :
    data = loadJSON("data.json");
}
let video;
function setup(){
    createCanvas(innerWidth,innerHeight);
    // Creating our video here : 
    video = createVideo("Raiden.mp4");
    video.speed(3)
    video.volume(0);
    video.loop();
    video.hide();
} 
function draw(){
    background(0);
    data.data[3].score = score;
    if(currentScene == LOADING){
        loadingScene();
    }
    if(currentScene == MENU){
        MenuScreen();
    }
    if(currentScene == GAME){
        GameScene();
        updateScore();
        shipKeyboardMovement();
        CheckForCollision();
        backgroundMusic.setVolume(0);
        enemies.forEach((enemy)=>{
            enemy.attack()
        })
        bulletArr.forEach((b)=>{
            b.fire();
            // This means that if the bullet goes off the screen then remove it : 
            if(b.y < 0){
                bulletArr.splice(bulletArr.indexOf(b),1)
            }
        })
    // Same here. Every time partices are pushed in the particles array, we are displaying it onto the screen using it's spawnParticles method that we defined in the Particle class :
    particles.forEach((particle)=>{
        particle.spawnParticles();
    })
    }
    if(currentScene == GAMEOVER){
        Gameover();
    }
    if(currentScene == LEADERBOARD){
        Leaderboard();
    }
}
                    //   LOADING SCREEN : 
// Defining some variables related to our loading screen : 
let diameter = 0;
let increaseInSize = 1;
let x1 = 520;
let x2 = 620;
let y1 = 400;
let y2 = 390;
let frame = 0;
// Let's make the function to draw the loading screen here:
function loadingScene(){
    fill(255);
    textSize(50);
    textFont(font1)
    text('Loading...', innerWidth / 2 - 130, 200);
    // We are increasing the diameter of our cirlce :
    diameter += increaseInSize;
    // Don't get confused here. Let me explain. So we are adding something in the x values of both our circles.So that they move.
    // And when they go past a certain limit they come back and they keep doing the same. We were able to do this with this sin() function here. It returns us a value ranging form 0 to -1. That means it can return us a positive and negative value at the same time if we keep changing the number we give it(In this case that number is frame ).So that's what produces our loading effect. Same with the y position too.
    frame += 2;
    x1 += sin(frame) * 1.5;
    x2 -= sin(frame) * 1.5;
    y1 -= cos(frame) * 1.5;
    y2 += cos(frame) * 1.5;
    // First circle :
    fill(3, 252, 211);
    circle(x1,400,diameter);
    // Second circle : 
    fill(13, 5, 247);
    circle(x2,400,diameter);
    // Third circle : 
    fill(247, 2, 2);
    circle(570,y1,diameter);
    // Fourth circle : 
    fill(2, 247, 27);
    circle(570,y2,diameter);
    // When the diameter becomes less than zero then make the increaseSize variable a positive value so that the circle should grow. 
    if(diameter < 0){
        increaseInSize = Math.abs(increaseInSize)
    }
    // But when the diameter becomes greater than 60 make it negative so that the circle may shrink : 
    if(diameter >= 48){
        increaseInSize = -increaseInSize
    }
}
                        // MENU SCENE :
// Defining some variables related to our loading screen : 
// This is our function for the menu scene in our game : 
function MenuScreen(){
    let btn = select("#btn");
    btn.style("display","block");
    if(startMusic){
        // Starting the music here : 
        userStartAudio();
        backgroundMusic.play();
        backgroundMusic.loop();
        backgroundMusic.setVolume(0.2);
        startMusic = false;
    } 
    // If you press the start game button then move to the next scene :
    btn.mousePressed(()=>{
        btn.style('display',"none")
        currentScene = 2;
    })
    // We are displaying our video here with the help of image tag. 
    image(video,0,0,innerWidth,innerHeight)
}
                                // GAME SCENE 
// Here are all the variables used in this GameScene function : 
let moveDown = false;
let enemies = [];
let enemy;
let enemyX = 50
let enemyY = 0;
let enemyWidth = 100;
let enemyHeight = 100;
let startSound = true;
// Variables of our ship :
let ship; 
let shipX = 300;
let shipY = innerHeight - 50;
let shipWidth = 50;
let shipHeight = 50;
const SHIP_SPEED = 5;
// Change these value to change the WIDTH and HEIGHT of our BULLET :
let bullet; 
let bulletWidth = 80;
let bulletHeight = 60;
let bulletArr = [];
let score = 0;
// 2nd Array : 
// particles is an array that will contain all of our particle objects :
let particles = [];
let particleCount = 30;
function GameScene(){
    if(startSound){
        userStartAudio()
        backgroundMusic1.play();
        backgroundMusic1.loop();
        backgroundMusic1.setVolume(0.2);
        ship = createSprite(shipX,shipY,shipWidth,shipHeight);
        ship.addImage("normal",shipImg)
        ship.scale = 0.5;
        startSound = false;
    }
}
// This function handles all the keyboard movement for our ship : 
function shipKeyboardMovement(){
    //       These if statements handle Arrow Right movement : 
    if(kb.pressed("ArrowRight")){
        ship.velocity.x = SHIP_SPEED;
    }
    // This means if the right arrow key is released and the user is pressing the left arrow key only then stop the ship : 
    if(kb.released("ArrowRight")){
        if(!kb.pressing("ArrowLeft")){
            ship.velocity.x = 0;
        }
    }
    if(ship.x + shipWidth > 1130 && !kb.pressed("ArrowLeft")){
        ship.velocity.x = 0;
    }
//       These if statemnts will handle ArrowLeft : 
    if(kb.pressed("ArrowLeft")){
        ship.velocity.x = -SHIP_SPEED;
    }
    // This means if the left arrow key is released and the user is pressing the right arrow key only then stop the ship : 
    if(kb.released("ArrowLeft")){
        if(!kb.pressing("ArrowRight")){
            ship.velocity.x = 0;
        }
    }
    // Stopping the ship from going past the screen : 
    // From the left side :
    if(ship.x < 60 && !kb.pressed("ArrowRight")){
        ship.velocity.x = 0;
    }
//        These if statements will handle ArrowUp : 
    if(kb.pressed("ArrowUp") ){
        ship.velocity.y = -SHIP_SPEED;
    }
    // This if statement will stop the ship from going past a certain limit upwards :
    if(ship.y < 400){
        ship.velocity.y = 0;
    }
    // Stopping on release : 
    if(kb.released("ArrowUp")){
        ship.velocity.y = 0;
    }
//        These if statements will handle ARROW DOWN : 
    if(kb.pressed("ArrowDown") ){
        ship.velocity.y = SHIP_SPEED;
    }
    // This if statement will stop the ship from going past a certain limit upwards :
    if(ship.y + shipHeight >  721 && !kb.pressing("ArrowUp")){
        ship.velocity.y = 0;
    }
    // Stopping on release : 
    if(kb.released("ArrowDown")){
        ship.velocity.y = 0;
    }

// Here comes the part where we are going to shoot bullets to destroy the enemies : 
    if(kb.released(" ")){
        // Here we are pushing a new Bullet object each time the space key is released. 
        //  Important Note: We are substracting half of the bulletWidth from it's x pos because we want the bullet to emerge from the center of the ship not from the side of our ship.
        fire.play()
        bulletArr.push(new Bullet(ship.x - bulletWidth / 2,ship.y,10,10,bulletWidth,bulletHeight));
    }
}
// Important Note : All of our collision detections are handled by this function. It's a bit messy but I'll try my best to write comment for every line of code so that you can understand it.
let bulletDestroyed = false;
// This function handles all the collision detections : 
function CheckForCollision(){
    // This checks for collision detection between our enemy and our bullet : 
    // It is recommended that you read the EXPLANATION below first then look at the code :
    bulletArr.forEach((bullet)=>{
        enemies.forEach((enemy)=>{
            if(dist(bullet.x,bullet.y,enemy.x,enemy.y) < 50){
                hit.play();
                score+= 10;
                enemies.splice(enemies.indexOf(enemy),1);
                bulletArr.splice(bulletArr.indexOf(bullet),1)
                // To spawn particles we are using another for loop :
                // Because we are not spawing only one particle here. We are spawing multiple particles at the same time.We only need to increase the variable particleCount to spawn more particles as the for loop will run as many times as the particleCount is. 
                for(let j = 0; j < particleCount; j++){
                    // The particles are not going into the same direction they are going into random directions with random x and y velocity's.
                    let vx = randomIntFromInterval(-25, 25); // Random x velocity .
                    let vy = randomIntFromInterval(-20, 20); // Random y velocity .
                    // And finally pushing the particles in the particle array and remember we are only pushing the particles here in the particle array. The particles are being displayed because we are calling the particles spawn function in our draw function :
                    particles.push(new Particle(bullet.x,bullet.y,10,vx,vy,"red"))
                }
        }
    })
    }) 
                        //  EXPLANATION IS HERE : 
    // Important Note : Don't get Confused here. We are doing collision detection here using nested loop (A loop inside of a loop).By comparing every bullet object's x and y position in the bulletArr with every enemy object's x and y position in the enemies array.  
    //  I haven't used the p5.play's collide function here because that is not efficient and was creating problems. Instead I have used the built-in function in p5.js called dist(). It gives us the distance between two objects and by getting the distance between two objects we can know when they are colliding.
    // Now What are we doing here ?
    // Remember we are storing all of our bullets in an array called bulletArr and all of our enemies in the enemies array because that was mentioned in the requirements that you should at least have three arrays.
    // Now we are going to use loops here (that was also mentioned in the requirements ) to detect collision detection :
    // We are saying for each bullet in the bulletArr and for each enemy in our enemies array. We are going to select each element of bulletArr and compare it's x and y value with each and every element of enemies array and if their distance is less than 50 we are going to spawn particles.
    // Short Explanation :
    //  Means when we press space a bullet is fired and this function is going to check if the bullet is colliding with the enemy of if it is close to the enemy. If it is then we are going to remove the bullet from the screen and also the enemy.And then we are going to spawn blood particles that will go in random directions. Easy right?
    // This is very less code if we see closely and really easy. I know it's difficult for a beginner. But I have done my best here to explain every line of code to you.

    // Second collision Detection : 
    // Now we are going to detect collision detection between our player's spaceship and our enemy ship :
        enemies.forEach((enemy)=>{
            if(dist(ship.x,ship.y,enemy.x,enemy.y) < 100){
                enemies.splice(enemies.indexOf(enemy),1);
                hit.play()
                ship.remove();
                localStorage.setItem("score",score);
                // location.href = "gameover.html"
                currentScene = 4;
        }
    })
}
class Enemy{
    constructor(x,y,velx,vely,width,height){
        this.x = x;
        this.y = y;
        this.velx = velx;
        this.vely = vely;
        this.width = width;
        this.height = height;
    }
    attack(){
        image(enemyImg,this.x,this.y,this.width,this.height)
        // These two if conditions will move the enemy from left to right.
        // if the enemy's x position touches the end of the screen then reverse it's direction : 
        if(this.x + this.width > innerWidth){
            this.velx = -this.velx
            moveDown = true;
        }
        // Or if enemy's x goes below zero. It means goes off the screen from the left side then reverse the direction here too. 
        else if(this.x < 0){
            this.velx = -this.velx
            moveDown = true;
        }
        if(moveDown){
            this.y += this.vely;
            moveDown = false;
        }
        this.x += this.velx
    }
}
class Particle {
    constructor(x, y, radius, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.dx = dx;
        this.dy = dy;
        this.color = color
    }
    makeParticle() {
        fill(this.color)
        circle(this.x, this.y, this.radius);
    }
    spawnParticles() {
        this.makeParticle();
        this.x += this.dx;
        this.x -= this.dy;
        this.y -= this.dy;
        this.x += this.dy;
        if (this.radius > 0) {
            this.radius -= 0.05
        }
        if (this.radius <= 0 || this.radius < 1 || this.x > innerWidth || this.y > innerHeight) {
            particles.splice(particles.indexOf(this), 1)
        }
    }
}
class Bullet{
    constructor(x,y,velx,vely,width,height){
        this.x = x;
        this.y = y;
        this.velx = velx;
        this.vely = vely;
        this.width = width;
        this.height = height;
    }
    fire(){
        image(bulletImg,this.x,this.y,this.width,this.height);
        this.y -= this.vely
    }
}
// Here I am pushing a new Enemy in the enemies array every 1000 milliseconds (1 second):
setInterval(()=>{
    if(currentScene == GAME){
        enemies.push(new Enemy(20,100,5,100,enemyWidth,enemyHeight));
    }
},1000);
// Some Utility Functions : 
// This function returns us a random number from min to max :
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
// This function basically creates two h1 tags and appends them to the body : (Vanilla javascript: You can ignore this. This is not that ignore this)
function displayScore(){
    let h1 = document.createElement("h1");
    h1.style.color = "white"
    h1.style.position = "absolute";
    h1.style.zIndex = "1"
    h1.style.top = "20px"
    h1.style.left = "20px"
    h1.innerText = "High Score"
    h1.id = "highscore";
    document.body.appendChild(h1)
    let scoreElem = document.createElement("h1");
    scoreElem.id = "score1"
    scoreElem.style.color = "white"
    scoreElem.style.position = "absolute";
    scoreElem.style.zIndex = "1"
    scoreElem.style.left = "200px"
    scoreElem.style.top = "20px"
    scoreElem.innerText = `${score}`
    document.body.appendChild(scoreElem)
}
// This function updates the score whenever the enemy is hit by our player's space ship. We are basically going to call this function in the draw function: 
displayScore();
function updateScore(){
    // I want to run this only once to 
    let scoreElem = document.getElementById("score1");
    scoreElem.innerText = `${score}`;
}
// Our GameOver scene is here : 
let i = 0;
function Gameover(){
    let btn = select("#btn2");
    btn.style("display","block")
    let btn2 = select("#btn3");
    btn2.style("display","block")
    btn2.style("margin-left","50%")
    let h1 = select("#score1");
    let highscore = select("#highscore");
    background(0)
    text("Game Over",400,300);
    textSize(50);
    textFont(font2_bold)
    backgroundMusic1.setVolume(0);
    btn.mousePressed(()=>{
        h1.remove()
        highscore.remove();
        btn.style('display',"none")
        btn2.style("display","none")    
        currentScene = 3;
    })
    btn2.mousePressed(()=>{
        location.reload();
    })
    // This is so it only runs one time not every frame because this function is being called in the draw function:
    if(i <= 0){
        setTimeout(()=>{
            // location.reload()
        },6000)
    }
    i++
}
setTimeout(()=>{
    // Setting the current screen to menu scene after 5000 milliseconds (5 seconds): 
    currentScene = 1;
    startMusic = true;
},6000);
// Here is our function for Leaderboard scene : 
function Leaderboard(){
    background(0);
    let container = select(".container")
    container.style("color","white")
    container.style('display',"flex")
    let rank = select("#rank");
    let name = select("#name");
    let scoreElem = select("#scorel");
    // Player's high score :
    let score = document.getElementById("highscorel")
    console.log(score)
    let gamebtn = select("#game");
    let h1 = document.createElement("h1")
    console.log(data.data[3])
    score.innerText = data.data[3].score
    score.style.color = "red"
    h1.style.color = "red"
    h1.innerText = getItem("username")
}