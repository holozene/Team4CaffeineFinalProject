"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Brain from "./brain.js";
//import Hero from "./objects/hero.js";
import Minion from "./minion.js";
import Interpolate from "../../engine/utils/lerp.js";

class Patrol extends engine.GameObject {
    constructor(kMinionPortal, spriteTexture2, spriteTexture3, atX, atY) {
        super(null);

        this.boundingBox;

        this.head = new Brain(spriteTexture3, atX, atY);
        this.topObject = new Minion(spriteTexture2, atX + 30, atY + 18);
        this.botObject = new Minion(spriteTexture2, atX + 30, atY - 18);

        this.topObjectPosition;
        this.topObjectSize = this.topObject.getXform().getSize();

        this.botObjectPosition;
        this.botObjectSize = this.botObject.getXform().getSize();

        this.headPosition;

        this.shouldBeDestroyedV = false;

        this.downRight;
        this.downLeft;
        this.topRight;
        this.topLeft;

        this.directionMovingX = 1.0;
        this.directionMovingY = 1.0;

        this.speed = 2;
        this.randomSpeedX = Math.random() * this.speed;
        this.randomSpeedY = Math.random() * this.speed;

        this.uP = true;
        this.side = true;

        this.interpolateTopX = new Interpolate(this.head.getXform().getXPos() + 10, 120, 0.05);
        this.interpolateTopY = new Interpolate(this.head.getXform().getYPos() + 6, 120, 0.05);
        this.interpolateBotX = new Interpolate(this.head.getXform().getXPos() + 10, 120, 0.05);
        this.interpolateBotY = new Interpolate(this.head.getXform().getYPos() - 6, 120, 0.05);

         this.canon3 = false; 
         this.canonFire = false;
         this.canonSpin = false;
    }

    drawInPatrol(camera) {
        // remember to update this.mRenderComponent's animation
        this.head.draw(camera);
        this.topObject.draw(camera);
        this.botObject.draw(camera);
    }
    getHeadXForm(){

        return this.head.getXform();
    }

    update(camera) {
        this.head.update();
        this.topObject.update();
        this.botObject.update();

        this.setupRandomDirection(camera);
        this.head.getXform().setPosition(
            this.head.getXform().getXPos() + (this.randomSpeedX * this.directionMovingX),
            this.head.getXform().getYPos() + (this.randomSpeedY * this.directionMovingY));

        this.interpolateTopX.setFinal(this.head.getXform().getXPos() + 30);
        this.interpolateTopY.setFinal(this.head.getXform().getYPos() + 18);
        this.interpolateBotX.setFinal(this.head.getXform().getXPos() + 30);
        this.interpolateBotY.setFinal(this.head.getXform().getYPos() - 18);
        this.topObject.getXform().setXPos(this.interpolateTopX.get());
        this.topObject.getXform().setYPos(this.interpolateTopY.get());
        this.botObject.getXform().setXPos(this.interpolateBotX.get());
        this.botObject.getXform().setYPos(this.interpolateBotY.get());
        this.interpolateTopX.update();
        this.interpolateTopY.update();
        this.interpolateBotX.update();
        this.interpolateBotY.update();

       // if (this.head.getXform().getXPos() > camera.getWCWidth() + 10) this.head.die = true;
        if (this.topObject.die || this.botObject.die || this.head.die) {
            this.shouldBeDestroyedV = true;
        }
    }

    setupRandomDirection(camera) {
        this.topObjectPosition = this.topObject.getXform().getPosition();
        this.botObjectPosition = this.botObject.getXform().getPosition();
        this.headPosition = this.head.getXform().getPosition();

        this.downRight = [this.botObjectPosition[0] + (this.botObjectSize[0] / 2), this.botObjectPosition[1] - (this.botObjectSize[1] / 2)];
        this.downLeft = [this.botObjectPosition[0] - (this.botObjectSize[0] / 2), this.botObjectPosition[1] - (this.botObjectSize[1] / 2)];

        this.topRight = [this.topObjectPosition[0] + (this.topObjectSize[0] / 2), this.topObjectPosition[1] + (this.topObjectSize[1] / 2)];
        this.topLeft = [this.topObjectPosition[0] - (this.topObjectSize[0] / 2), this.topObjectPosition[1] + (this.topObjectSize[1] / 2)];

        let cWidth = camera.getWCWidth();
        let cCenter = camera.getWCCenter();
        let cHight = camera.getWCHeight();

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


    getBoundingBox() {
        this.topObjectPosition = this.topObject.getXform().getPosition();
        this.botObjectPosition = this.botObject.getXform().getPosition();

        let downRight = [botObjectPosition[0] + botObjectSize[0] / 2, botObjectPosition[1] - botObjectSize[1] / 2];
        let downLeft = [botObjectPosition[0] - botObjectSize[0] / 2, botObjectPosition[1] - botObjectSize[1] / 2];

        let topRight = [topObjectPosition[0] + topObjectSize[0] / 2, topObjectPosition[1] + topObjectSize[1] / 2];
        let topLeft = [topObjectPosition[0] - topObjectSize[0] / 2, topObjectPosition[1] + topObjectSize[1] / 2];

        let width = topRight[0] - topLeft[0];
        let height = topRight[1] - downRight[1];
        let center = [downLeft[0] + width / 2, downRight[1] + height / 2];
        this.boundingBox = new engine.BoundingBox(center, width, height);

        return this.boundingBox;
    }
}

export default Patrol;