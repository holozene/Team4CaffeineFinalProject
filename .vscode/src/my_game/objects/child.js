/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import WASDObj from "./wasd_obj.js";
import engine from "../../engine/index.js";

class Child extends WASDObj {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(60, 35);
        this.mRenderComponent.getXform().setSize(2, 2);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);

        let r = new engine.RigidRectangle(this.getXform(), 2, 2);
        this.setRigidBody(r);
        // this.toggleDrawRenderable();
        this.toggleDrawRigidShape();
    }
}

export default Child;