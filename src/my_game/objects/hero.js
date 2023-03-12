"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(200, 600);
        this.mRenderComponent.getXform().setSize(250, 250);  
        this.mRenderComponent.setElementPixelPositions(0, 100, 0, 100);
        this.oscillate = false;

        this.canon3 = false; 
        this.canonFire = false;
        this.canonSpin = false;
        this.canonType =0;
    }






    update(camra) {
        //if () {
          //  this.dyePacks.push(new DyePack(this.stwarSprite, this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos()));
       // }
    }
}

export default Hero;