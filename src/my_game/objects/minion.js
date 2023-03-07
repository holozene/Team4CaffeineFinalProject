"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Minion extends engine.GameObject {
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.2;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(10, 10);
        this.mRenderComponent.setElementPixelPositions(100, 230, 0, 100);
        this.mRenderComponent.getXform().setRotationInDegree(180);
              // horizontal padding in between
       
        this.die = false;
    }

    update() {
        // remember to update this.mRenderComponent's animation
  
    }

    hit() {
        this.mRenderComponent.setColor([1, 1, 1, this.mRenderComponent.getColor()[3] + 0.2]);
           
        if(this.mRenderComponent.getColor()[3] >= 1){
            this.die = true;
        }
    }
}

export default Minion;