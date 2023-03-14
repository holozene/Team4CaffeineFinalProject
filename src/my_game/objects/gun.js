"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Gun extends engine.GameObject {
    constructor(spriteTexture, x, y, type) {
        super(type);
        this.kDelta = 0.2;
        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(x, y);
        this.getXform().setSize(0.2, 0.2);

        if (type === undefined) {
            let randomN = Math.random();
            if (randomN <= .3)
                type = 0;
            else if (randomN > .3 && randomN <= .7)
                type = 1;
            else
                type = 2;
        }

        switch (type) {
            case 0:
                this.firstPix = 217;
                this.secondPix = 342;
                this.thirdPix = 5;
                this.forthPix = 135;
                break;
            case 1:
                this.firstPix = 490;
                this.secondPix = 580;
                this.thirdPix = 40;
                this.forthPix = 100;
                break;
            case 2:
                this.firstPix = 590;
                this.secondPix = 735;
                this.thirdPix = 15;
                this.forthPix = 120;
                break;
        }

        this.mRenderComponent.setElementPixelPositions(this.firstPix, this.secondPix, this.thirdPix, this.forthPix);
        // this.mRenderComponent.getXform().setRotationInDegree(180);
        // this.die = false;
        // this.size = this.mRenderComponent.getXform().getSize();

        this.shouldBeDestroyedV = false;
        this.targetMouse = false;
    }

    update(x, y) {
        let delta = 0.01;
        let xform = this.mRenderComponent.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            xform.incYPosBy(delta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            xform.incYPosBy(-delta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            xform.incXPosBy(-delta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            xform.incXPosBy(delta);
        }


        // x and y are the mouse position
        // handle the position not being set
        if (this.targetMouse) xform.setRotationInRad(this.aimAt(x, y, xform));

        if (engine.input.isKeyClicked(engine.input.keys.F)) {
            this.targetMouse = !this.targetMouse;
        }
    }



    aimAt(x, y, xform) {
        let parentXform = this.mRenderComponent.getParentXform();
        let worldXform = this.mRenderComponent.getGlobalXform();
        let worldX = worldXform.getXPos();
        let worldY = worldXform.getYPos();
        if (!x)
            x = 0;
        if (!y)
            y = 0;
        const Xdelta = worldX - x;
        const Ydelta = worldY - y;
        let angle = Math.atan(Ydelta / Xdelta);
        if (Xdelta >= 0)
            return angle + Math.PI - parentXform.getRotationInRad();
        else
            return angle - parentXform.getRotationInRad();
    }

    // draw(camera) {
    //     super.draw(camera);
    //     this.mRenderComponent.draw(camera);
    // }

    // hit() {
    //     this.mRenderComponent.setColor([1, 1, 1, this.mRenderComponent.getColor()[3] + 0.2]);

    //     if (this.mRenderComponent.getColor()[3] >= 1) this.die = true;
    // }
}

export default Gun;