var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;
var bedroom, garden, washroom;
var gameState, CurrentGameState;
var currentTime;

function preload() {
  sadDog = loadImage("Images/Dog.png");
  happyDog = loadImage("Images/happy dog.png");
  bedroom = loadImage("Images/Bed Room.png");
  garden = loadImage("Images/Garden.png");
  washroom = loadImage("Images/Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  currentTime = database.ref("currentTime");
  currentTime.on("value", checkTime);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  // currentTime = hour();

  if(currentTime==(lastFed+1)){
      // update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    // update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    // update("Bathing");
      foodObj.washroom();
   }else{
    // update("Hungry")
    foodObj.display();
   }

  currentTime = database.ref("currentTime");
  currentTime.on("value", function (data) {
    currentTime = data.val();
  });

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  // if (currentTime === lastFed + 1) {
  //   update("Hungry");
  //   foodObj.garden();
  // } else if (currentTime === lastFed + 2) {
  //   foodObj.bedroom();
  // } else if (currentTime > lastFed + 2 && currentTime < lastFed + 4) {
  //   foodObj.washroom();
  // }

  gameState = database.ref("gameState");
  gameState.on("value", function (data) {
    CurrentGameState = data.val();
  });

  if (CurrentGameState !== "hungry") {
    addFood.hide();
    feed.hide();
    dog.x = 4000;
    dog.y = 4000;
  } else {
    addFood.show();
    feed.show();
    dog.changeImage(sadDog);
    dog.x = 800;
    dog.y = 200;
  }

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed : " + (lastFed % 12) + " PM", 350, 30);
  } else if (lastFed == 0) {
    text("Last Feed : 12 AM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  
  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
  });
}

function addFoods() {
  foodS++;
  database.ref("/").update({
    Food: foodS,
  });
}

function checkTime() {
  database.ref("/").update({
    currentTime: hour()
  });
}