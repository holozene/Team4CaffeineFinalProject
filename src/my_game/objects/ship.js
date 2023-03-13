"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Interpolate from "../../engine/utils/lerp.js";
import Gun from "./gun.js";

class Ship extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(600, 600);
        this.mRenderComponent.getXform().setSize(100, 100);
        this.mRenderComponent.setElementPixelPositions(0, 100, 0, 100);

        this.interpolateX = new Interpolate(this.mRenderComponent.getXform().getXPos(), 420, 0.05);
        this.interpolateY = new Interpolate(this.mRenderComponent.getXform().getYPos(), 420, 0.05);

        this.mTurret = new Gun(spriteTexture, 10, 10, 0);
        this.mTurret.setParent(this);
        // this.mTurret.getXform().setYPos(600);

    }

    update(camera) {
        let x = null;
        let y = null;
        if (camera.isMouseInViewport()) {
            x = camera.mouseWCX();
            y = camera.mouseWCY();

            this.interpolateX.setFinal(x);
            this.interpolateX.update();
            this.mRenderComponent.getXform().setXPos(this.interpolateX.get());
            this.interpolateY.setFinal(y);
            this.interpolateY.update();
            this.mRenderComponent.getXform().setYPos(this.interpolateY.get());
        }
        this.mTurret.update(x, y);

        // control size with W+S
        let xform = this.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            xform.setHeight(xform.getHeight()+this.kDelta);
            xform.setWidth(xform.getWidth()+this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            xform.setHeight(xform.getHeight()-this.kDelta);
            xform.setWidth(xform.getWidth()-this.kDelta);
        }
        // control rotation with AD
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            xform.incRotationByDegree(1);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            xform.incRotationByDegree(-1);
        }


        //     for (let i = 0; i < this.guns.length; i++) {
        //         this.guns[i].update(this.mCamera);

        //         if (this.guns[i].shouldBeDestroyedV)
        //             this.guns.splice(i, 1);

        //    ///.________________________________setAsChild()
        //         if (this.mShip.pixelTouches(this.guns[i], this.pixelTouchesArray)) {
        //             this.guns[i].isChild = true; 
        //             this.mShip.addChild(this.guns[i]);
        //             this.guns.splice(i, 1);            
        //          }
        //     }
    }

    draw(camera) {
        super.draw(camera);
        // this.mTurret.draw(camera);
        // this.mTest.draw(camera);
    }
}

export default Ship;