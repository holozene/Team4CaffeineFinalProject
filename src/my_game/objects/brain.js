"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Brain extends engine.GameObject {
    constructor(spriteTexture,x,y ) {
        super(null);
        this.kDeltaDegree = 1;
        this.kDeltaRad = Math.PI * this.kDeltaDegree / 180;
        this.kDeltaSpeed = 3;
        this.mRenderComponent =  new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(x, y);
        this.mRenderComponent.getXform().setSize(150, 50);
        this.mRenderComponent.setElementPixelPositions(300, 550, 285 ,400);
        this.mRenderComponent.getXform().setRotationInDegree(180);
       
        this.die = false;
    }

    
    hit() {
        this.mRenderComponent.getXform().incXPosBy(5);
      
    }

    update() {
        if (engine.input.isKeyClicked(engine.input.keys.J)) {
            this.hit();
        }
    }
}

export default Brain;