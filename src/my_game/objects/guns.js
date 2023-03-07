"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Guns extends engine.GameObject {
    constructor(spriteTexture, x, y) {
        super(null);
        this.kDelta = 0.2;
        this.mRenderComponent =  new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(x, y);
        this.mRenderComponent.getXform().setSize(50, 50);
        this.firstPix=0;
        this.secondPix=0;
        this.thirdPix=0;
        this.forthPix=0; 
        this.renbdomN = Math.random();
        this.GunType = 0;
        if(this.renbdomN <= .3){

        this.firstPix=250;
        this.secondPix=350;
        this.thirdPix=0;
        this.forthPix=100; 

      
         
        }else if (this.renbdomN >.3 && this.renbdomN <=.7 ){

         this.firstPix=490;
        this.secondPix=580 ;
         this.thirdPix=0;
         this.forthPix=100;
        }else{

        this.firstPix=590;
        this.secondPix=735 ;
         this.thirdPix=0;
         this.forthPix=120;

        }
         
        
        this.mRenderComponent.setElementPixelPositions(this.firstPix, this.secondPix, this.thirdPix, this.forthPix);
        this.mRenderComponent.getXform().setRotationInDegree(180);
        this.die = false;
        this.size = this.mRenderComponent.getXform().getSize();

        this.shouldBeDestroyedV= false;
        this.downRight;
        this.downLeft;
        this.topRight;
        this.topLeft;

        this.directionMovingX = 1.0;
        this.directionMovingY = 1.0;

        this.speed = .5;
        this.randomSpeedX = Math.random() * this.speed;
        this.randomSpeedY = Math.random() * this.speed;

        this.uP = true;
        this.side = true;
    }

    updateG(camra) {
        // remember to update this.mRenderComponent's animation

        this.setupRandomDirection(camra);
        this.mRenderComponent.getXform().setPosition(
            this.mRenderComponent.getXform().getXPos() + (this.randomSpeedX * this.directionMovingX),
            this.mRenderComponent.getXform().getYPos() + (this.randomSpeedY * this.directionMovingY));

     
        if (this.mRenderComponent.getXform().getXPos() > camra.getWCWidth() + 10){

        };
        if (this.mRenderComponent.die) {       

       }
}
    drawGuns(camra){
        this.mRenderComponent.draw(camra);

    }


    setupRandomDirection(camra) {

        this.object = this.mRenderComponent.getXform().getPosition();

        this.downRight = [this.object[0] + (this.size[0] / 2), this.object[1] - (this.size[1] / 2)];
        this.downLeft = [this.object[0] - (this.size[0] / 2), this.object[1] - (this.size[1] / 2)];

        this.topRight = [this.object[0] + (this.size[0] / 2), this.object[1] - (this.size[1] / 2)];
        this.topLeft = [this.object[0] - (this.size[0] / 2), this.object[1] - (this.size[1] / 2)];


        let cWidth = camra.getWCWidth();
        let cCenter = camra.getWCCenter();
        let cHight = camra.getWCHeight();

        let cDownRight = [cCenter[0] + (cWidth / 2), cCenter[1] - (cHight / 2)];
        let cDownLeft = [cCenter[0] - (cWidth / 2), cCenter[1] - (cHight / 2)];

        let cTopRight = [cCenter[0] + (cWidth / 2), cCenter[1] + (cHight / 2)];
        let cTopLeft = [cCenter[0] - (cWidth / 2), cCenter[1] + (cHight / 2)];

        if ((this.downLeft[1] - cDownRight[1]) <= 0 && this.up) {
            //calculateDirection("botWall");
            this.randomSpeedX = (Math.random()) * this.speed;
            this.randomSpeedY = (Math.random()) * this.speed;
            this.directionMovingY = this.directionMovingY * -1;
            this.up = false;
        }
        if ((this.downLeft[0] - cDownRight[0]) >= 0 && this.side) {
            //calculateDirection("rightWall");
            this.randomSpeedX = (Math.random()) * this.speed;
            this.randomSpeedY = (Math.random()) * this.speed;
            this.directionMovingX = this.directionMovingX * -1;
            this.side = false;
        }
        if ((this.downLeft[0] - cTopLeft[0]) <= 0 && !this.side) {
            // calculateDirection("leftWall");
            this.randomSpeedX = (Math.random()) * this.speed;
            this.randomSpeedY = (Math.random()) * this.speed;
            this.directionMovingX = this.directionMovingX * -1;
            this.side = true;
        }
        if ((this.topLeft[1] - cTopRight[1]) >= 0 && !this.up) {
            //calculateDirection("upWall"); 
            this.randomSpeedX = (Math.random()) * this.speed;
            this.randomSpeedY = (Math.random()) * this.speed;
            this.directionMovingY = this.directionMovingY * -1;
            this.up = true;
        }
    }



    hit() {
        this.mRenderComponent.setColor([1, 1, 1, this.mRenderComponent.getColor()[3] + 0.2]);
           
        if(this.mRenderComponent.getColor()[3] >= 1){
            this.die = true;
        }
    }
}

export default Guns;