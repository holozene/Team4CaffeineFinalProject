"use strict";  // Operate in Strict mode such that variables must be declared before used!


import engine from "../../engine/index.js";
import Oscillate from "../../engine/utils/oscillate.js";



class DyePack extends engine.GameObject {
  constructor(spriteTexture, x, y, angle) {
    super(null);

    this.kDelta = 0.5;

    this.creationTime = performance.now();
    this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
    this.mRenderComponent.setColor([1, 1, 1, 0.1]);
    this.mRenderComponent.getXform().setPosition(x, y);

    this.angle = angle;
    this.mRenderComponent.getXform().setSize(10, 20);
    this.mRenderComponent.setElementPixelPositions(375, 450, 0, 175) ;
    this.mRenderComponent.getXform().setRotationInDegree(90);

    // this.timeOfLife = 2000;
    this.lifeSpan = 1000;
    this.shouldBeDestroyedV = false;


    this.units = 600;
    this.frames = 60;

    this.speed = (this.units / this.frames);

    this.oscillate = false;

    this.mBounce = new engine.Oscillate(1.5, 10, 100);
  }

  update(camera) {
    // Camera for size
    this.mRenderComponent.getXform().incYPosBy(this.speed * Math.sin(this.angle));
    this.mRenderComponent.getXform().incXPosBy(this.speed * Math.cos(this.angle));

    if (engine.input.isKeyPressed(engine.input.keys.D)) {
      this.speed -= 0.1;
    }

    if (engine.input.isKeyPressed(engine.input.keys.S)) {
      this.collision();
    }

    if (this.speed <= 0 || performance.now() - this.creationTime > this.lifeSpan ||
      (this.mRenderComponent.getXform().getXPos() >= (camera.getWCWidth() / 2 + camera.getWCCenter()[0]))) {
      this.shouldBeDestroyedV = true;
    }

    if (this.oscillate === true) {
      if (!this.mBounce.done()) {
        this.mRenderComponent.getXform().incXPosBy(this.mBounce.getNext());
      }
      else {
        this.isOscillating = false;
        this.speed = 0;
      }
    }
  }

  // createLifespan() {
  //   return Math.random() * this.timeOfLife;
  // }

  collision() {
    this.speed = 0.1;
    this.oscillate = true;
    if (this.mBounce !== null) {
      this.mBounce.reStart();
    }
  }
}
/*
Hit: When pixel collide with a Patrol. A DyePack will oscillates according to our damped harmonic function where: 
X/Y Amplitude: 4, 0.2
Frequency: 20
Duration: 300 frames [we can grade this behavior]
*/
export default DyePack;