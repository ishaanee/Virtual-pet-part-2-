var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroom, garden, washroom
gamestate=0;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
bedroom=loadImage("bedroom.png");
garden=loadImage("Garden.png");
washroom=loadImage("washroom.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  
  
    
  foodObj = new Food();
  lastfed = new Food();
  CurrentTime=hour();

  function update(state)
     {
         database.ref ('/').update({
             gamestate:state
         })

         
     }
     
  function updateFoodStock(foodStock){
    this.foodStock=foodStock;
    foodStock=database.ref('Food');
  foodStock.on("value",readStock);

   }

   function getFedTime(lastFed){
     this.lastFed=lastFed;
     fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
   }

   function deductFood(){
     if(this.foodStock>0){
      this.foodStock=this.foodStock-1;
     }
    }

    function getFoodStock(){
      return this.foodStock;
    }

  
  
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
  
}

function draw() {
  background(46,139,87);
  foodObj.display();

  
     
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12)
  {
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }
   else if(lastFed==0)
   {
     text("Last Feed : 12 AM",350,30);
   }
   else
   {
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
   
if(CurrentTime==(lastfed+1)){
	update("Playing") ;
	foodObj.garden();
}
else if (CurrentTime==(lastfed+2)){
	update("Sleeping") ;
	foodObj.bedroom();
}
else if ((CurrentTime>(lastfed+2)) && currentTime<=(lastFed+4)){
	update("Bathing") ;
	foodObj.washroom();
}
else {
	update("Hungry") ;
	foodObj.display();
}
if(gameState!= "Hungry")
{
	feed.hide();
	addFood.hide();
	dog.remove();
  }
  else
  {
	feed.show();
	addFood.show();
	dog.addImage(sadDog);
	}
	
  readStock()
  feedDog()
  fedtime()
  
  drawSprites();


//function to read food Stock


}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


  

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
