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
                this.firstPix = 250;
                this.secondPix = 350;
                this.thirdPix = 0;
                this.forthPix = 100;
                break;
            case 1:
                this.firstPix = 490;
                this.secondPix = 580;
                this.thirdPix = 0;
                this.forthPix = 100;
                break;
            case 2:
                this.firstPix = 590;
                this.secondPix = 735;
                this.thirdPix = 0;
                this.forthPix = 120;
                break;
        }

        this.mRenderComponent.setElementPixelPositions(this.firstPix, this.secondPix, this.thirdPix, this.forthPix);
        // this.mRenderComponent.getXform().setRotationInDegree(180);
        // this.die = false;
        // this.size = this.mRenderComponent.getXform().getSize();

        this.shouldBeDestroyedV = false;
        this.downRight;
        this.downLeft;
        this.topRight;
        this.topLeft;

        this.directionMovingX = 1.0;
        this.directionMovingY = 1.0;

        this.speed = .5;
        this.randomSpeedX = 0; //Math.random() * this.speed;
        this.randomSpeedY = 0; //Math.random() * this.speed;

        this.uP = true;
        this.side = true;
    }

    update(x, y) {
        if (engine.input.isKeyClicked(engine.input.keys.X)) {
            console.log(this.mRenderComponent.getXform().getXPos(),
                this.mRenderComponent.getXform().getYPos());
        }

        // if (this.mRenderComponent.die) {}

        let delta = 1;
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

        let parentXform = this.mRenderComponent.getParentXform();

        if (x) {
            // x and y are the mouse position
            // console.log(xform);
            const Xdelta = parentXform.getXPos() + xform.getXPos() - x;
            const Ydelta = parentXform.getYPos() + xform.getYPos() - y;
            let slope = Ydelta / Xdelta;
            if (Xdelta >= 0) xform.setRotationInRad(Math.atan(slope) + Math.PI);
            else xform.setRotationInRad(Math.atan(slope));
        }
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