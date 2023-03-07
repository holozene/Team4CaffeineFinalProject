"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Guns extends engine.GameObject {
    constructor(spriteTexture, atX, atY) {
        super(null);
        this.kDelta = 0.2;
        this.mRenderComponent = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(atX, atY);
        this.mRenderComponent.getXform().setSize(10, 8);
        this.mRenderComponent.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mRenderComponent.setAnimationType(engine.eAnimationType.eSwing);
        this.mRenderComponent.setAnimationSpeed(30);
        this.die = false;
    }

    update() {
        // remember to update this.mRenderComponent's animation
        this.mRenderComponent.updateAnimation();
    }

    hit() {
        this.mRenderComponent.setColor([1, 1, 1, this.mRenderComponent.getColor()[3] + 0.2]);
           
        if(this.mRenderComponent.getColor()[3] >= 1){
            this.die = true;
        }
    }
}

export default Guns;