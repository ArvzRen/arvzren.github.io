var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cat, cat_running, cat_collided, cat_stop;
var ground, falseGround, groundImage;

var rewardGroup, rewardImage;
var window, windowImage
var obstaclesGroup, obstacle1, obstacle2;
var windowsGroup;

var score = 0;
var rewards = 0;
var lifes = 3; 
var showRewards = 5;

var gameOver, gameOverImg, restart, restartImg;

function preload() {
  cat_running = loadAnimation("./assets/Cat/cat-1.png", "./assets/Cat/cat-2.png", "./assets/Cat/cat-3.png",
    "./assets/Cat/cat-4.png", "./assets/Cat/cat-5.png");
  cat_collided = loadAnimation("./assets/Ghost/ghost-1.png", "./assets/Ghost/ghost-2.png", "./assets/Ghost/ghost-3.png", "./assets/Ghost/ghost-4.png",
    "./assets/Ghost/ghost-5.png", "./assets/Ghost/ghost-6.png", "./assets/Ghost/ghost-7.png", "./assets/Ghost/ghost-8.png",
    "./assets/Ghost/ghost-9.png", "./assets/Ghost/ghost-10.png");
  cat_stop = loadAnimation("./assets/Cat/cat-3.png","./assets/Cat/cat-3.png");
  groundImage = loadImage("./assets/ground.png");
  
  rewardImage = loadImage("./assets/food.png");

  obstacle1 = loadAnimation("./assets/Dog/dog-1.png", "./assets/Dog/dog-2.png","./assets/Dog/dog-3.png","./assets/Dog/dog-4.png","./assets/Dog/dog-5.png",
    "./assets/Dog/dog-6.png","./assets/Dog/dog-7.png");
  obstacle2 = loadImage("./assets/Plant/plant-1.png", "./assets/Plant/plant-1.png", "./assets/Plant/plant-1.png");
  
  restartImg = loadImage("./assets/restart.png");

  windowImage = loadImage("./assets/window.png");
}

function setup() {
  createCanvas(1000, 400);

  cat = createSprite(50, 350, 20, 50);
  cat.addAnimation("running", cat_running);
  cat.addAnimation("collided", cat_collided);
  cat.addAnimation("stop", cat_stop);
  cat.scale = 0.4;
  cat.setCollider("circle",0,0,100);


  ground = createSprite(200, 390, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);
  ground.depth = - 1;

  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  restart.depth = 2;

  falseGround = createSprite(200, 390, 1000, 10);
  falseGround.visible = false;

  rewardsGroup = new Group();
  obstaclesGroup = new Group();
  windowsGroup =  new Group();
  linesGroup = new Group();

}

function draw() {
  //cat.debug = true;
  background(237,214,0);
  
  mobile();
  spawnWindow();

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);

    if (keyDown("space") && cat.y >= 345) {
      cat.velocityY = -15;
    }

    cat.velocityY = cat.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    cat.collide(falseGround);
    spawnRewards();
    spawnObstacles();

    if (obstaclesGroup.isTouching(cat)) {
      gameState = END;
      lifes -= 1;
    }

    if (rewardsGroup.isTouching(cat)) {
      rewardsGroup.destroyEach();
      rewards += 1;
      showRewards -= 1;
    }

    if (rewards === 5){
      win();
    }

  }

  else if (gameState === END) {
    restart.visible = true;

    cat.velocityY = 0;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    rewardsGroup.setVelocityXEach(0);
    linesGroup.setVelocityXEach(0);
    windowsGroup.setVelocityXEach(0);

    cat.changeAnimation("collided", cat_collided);
    cat.scale=0.6;

    obstaclesGroup.setLifetimeEach(-1);
    rewardsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }

    if (lifes === 0) {
      gameOver();
    }
  }

  drawSprites();

  textWidth(5);
  fill("white");
  textSize(20);
  text("Score: " + score, 850, 40);
  text("Lifes: " + lifes, 50, 40);

  fill("#6cd8ff");
  textSize(30);
  text("Catch " + showRewards + " fish!", 400, 40);
}

function spawnRewards() {
  if (frameCount % 500 === 0) {
    var reward = createSprite(1000, 320, 40, 10);
    reward.y = Math.round(random(200, 300));
    reward.addImage(rewardImage);
    reward.scale = 0.08;
    reward.velocityX = -5;

    reward.lifetime = 400;
    reward.depth = cat.depth;
    cat.depth = cat.depth + 1;
    rewardsGroup.add(reward);
  }
}

function spawnObstacles() {
  if (frameCount % 70 === 0) {
    var obstacle = createSprite(1000, 320, 10, 40);
    obstacle.velocityX = -(6 + 3 * score / 100);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obstacle.addAnimation("obs1",obstacle1);
              obstacle.scale = 0.5;
              obstacle.setCollider("circle",0,50,70);
        break;
      case 2: obstacle.addAnimation("obs2",obstacle2);
              obstacle.scale = 0.6;
              obstacle.y = 310; 
              obstacle.setCollider("circle",0,70,50);
        break;
      default: break;
    }          
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function spawnWindow() {
  if (frameCount % 500 === 0) {
    var window = createSprite(1200, 150, 40, 10);
    window.addImage(windowImage);
    window.scale = 0.4;
    window.velocityX = -1;

    window.lifetime = 1500;
    window.depth = -2;
    cat.depth = cat.depth + 1;
    windowsGroup.add(window);
  }
}

function mobile() {
  if (frameCount % 250 === 0) {
    var lines = createSprite(1100, 200, 80, 400);
    lines.shapeColor = "#EDBE00";
    lines.velocityX = -1;
    lines.lifetime = 1500;
    lines.depth = -2;
    cat.depth = cat.depth + 1;
    linesGroup.add(lines);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  rewardsGroup.destroyEach();
  linesGroup.destroyEach();
  windowsGroup.destroyEach();

  cat.scale=0.4;
  cat.changeAnimation("running", cat_running);
}

function gameOver() {
  swal(
    {
      title: `Game Over \n Thanks for Playing`,
      text: "Special thanks to Lewis Hand for animations",
      imageUrl:
        "https://static.wixstatic.com/media/eeb0ab_e45c5305fe4f47009564934a7d9979e6~mv2.gif/v1/fit/w_185,h_185,q_90/eeb0ab_e45c5305fe4f47009564934a7d9979e6~mv2.gif",
      imageSize: "150x150",
      confirmButtonText: "Play again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function win() {
  swal(
    {
      title: `Congratulations! You won`,
      text: "Special thanks to Lewis Hand for animations",
      imageUrl:
        "https://static.wixstatic.com/media/eeb0ab_e45c5305fe4f47009564934a7d9979e6~mv2.gif/v1/fit/w_185,h_185,q_90/eeb0ab_e45c5305fe4f47009564934a7d9979e6~mv2.gif",
      imageSize: "150x150",
      confirmButtonText: "Play again"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
  cat.velocityY = cat.velocityY + 0.8;
  cat.changeAnimation("stop", cat_stop);
  cat.collide(falseGround);

  ground.velocityX = 0;
  obstaclesGroup.setVelocityXEach(0);
  rewardsGroup.setVelocityXEach(0);
  linesGroup.setVelocityXEach(0);
  windowsGroup.setVelocityXEach(0);
  obstaclesGroup.setLifetimeEach(-1);
  rewardsGroup.setLifetimeEach(-1);
}

