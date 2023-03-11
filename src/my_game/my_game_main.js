/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!
import Brain from "./objects/brain.js";
import engine from "../engine/index.js";

import Interpolate from "../engine/utils/lerp.js";
import Shake from "../engine/utils/shake_vec2.js";
import DyePack from "./objects/dye_pack.js";
import TextureObject from "./objects/texture_object.js";
import Patrol from "./objects/patrol.js";
import Minion from "./objects/minion.js";
import Hero from "./objects/hero.js";
import Gun from "./objects/gun.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.stwarSprite = "assets/result.png";
        this.kBg = "assets/sky.jpg";

        this.tempSTR = "XX";
        this.dyePacks = [];
        this.patrols = [];
        this.patrolsHead = [];
        this.guns = [];
        // The camera to view the scene
        this.mCamera = null;
        this.mHeroCam = null;
        this.pixelTouchesArray = [];
        this.cameraPos;
        this.cameraWidth;
        this.shake = null;

        this.time;
        this.Qactive = false;

        this.xPoint;
        this.yPoint;

        this.randomPosX;
        this.randomPosY;

        this.hitCam1 = null;
        this.hitCam2 = null;
        this.hitCam3 = null;
        this.hitCam4 = null;

        this.mBg = null;
        this.mMsg = null;


        // the hero and the support objects
        this.mHero = null;
        this.mTurret = null;
        this.mFocusObj = null;

        this.mChoice = 'D';
        this.dyePackx;

        this.interpolateX;
        this.interpolateY;


        this.randomSpawnPosX;
        this.randomSpawnPosY;

        this.numberOfdyePacks = 0;
        this.numberOfPatrolUnits = 0;

        this.autoSpawnString = "False";
        this.mBounce = new engine.Oscillate(1.5, 6, 120);
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kBg);
        engine.texture.load(this.stwarSprite);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kBg);
        engine.texture.unload(this.stwarSprite);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(1000, 600), // position of the camera
            2000,                       // width of camera
            [0, 0, 2000, 500]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);
        // sets the background to gray

        this.hitCam1 = new engine.Camera(
            vec2.fromValues(200, 200),    // will be updated at each cycle to point to hero
            50,
            [0, 600, 200, 200],
            2                           // viewport bounds
        );
        this.hitCam1.setBackgroundColor([0.85, 0.8, 0.8, 1]);

        // Large background image
        let bgR = new engine.SpriteRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 3000, 0, 789);
        bgR.getXform().setSize(2000, 600);
        bgR.getXform().setPosition(1000, 600);
        this.mBg = new engine.GameObject(bgR);
        engine.defaultResources.setGlobalAmbientIntensity(5);
        // Objects in the scene

        this.mHero = new Hero(this.stwarSprite);
        this.mTurret = new Gun(this.stwarSprite, 10, 30);
        this.mTurret.setParent(this.mHero);
      
       
        this.mFocusObj = this.mHero;

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(20, 0);
        this.mMsg.setTextHeight(25);

        // create objects to simulate various motions 
        this.mBounce = new engine.Oscillate(40.5, 40, 60); // delta, freq, duration  
        this.shake = new Shake(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos(), 5, 100);
        this.interpolateX = new Interpolate(this.mHero.getXform().getXPos(), 420, 0.05);
        this.interpolateY = new Interpolate(this.mHero.getXform().getYPos(), 420, 0.05);
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);

        //this.mRenderComponent.draw(camera);
        this.mHero.draw(camera);
        this.mTurret.draw(camera);
        for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].draw(camera);
        }
        for (let i = 0; i < this.patrols.length; i++) {
            this.patrols[i].drawInPatrol(camera);
        }
        for (let i = 0; i < this.guns.length; i++) {
            this.guns[i].draw(camera);
        }
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Draw with all three cameras
        this._drawCamera(this.mCamera);
        this.mMsg.draw(this.mCamera);   // only draw status in the main camera
    }

    update() {
        let zoomDelta = 0.05;

        // update objects
        this.mCamera.update();
        this.hitCam1.update();
        this.mHero.update(this.mCamera);
        this.mTurret.update(this.mCamera);
        this.mHero.update2(this.mCamera);
        // update dyepacks
        for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].update(this.mCamera);

            for (let j = 0; j < this.patrols.length; j++) {
                //Check if any dyePacks Are touching any Patrol units          
                if (this.dyePacks[i].pixelTouches(this.patrols[j].botObject, this.pixelTouchesArray)) {
                    this.dyePacks[i].collision();
                    this.patrols[j].botObject.hit();
                }
                if (this.dyePacks[i].pixelTouches(this.patrols[j].topObject, this.pixelTouchesArray)) {
                    this.dyePacks[i].collision();
                    this.patrols[j].topObject.hit();
                }
                if (this.dyePacks[i].pixelTouches(this.patrols[j].head, this.pixelTouchesArray)) {
                    this.dyePacks[i].collision();
                    this.patrols[j].head.hit();
                }
            }

            if (this.dyePacks[i].shouldBeDestroyedV)
                this.dyePacks.splice(i, 1);
        }






        // update patrols
        for (let i = 0; i < this.patrols.length; i++) {
            this.patrols[i].update(this.mCamera);
            // this.patrols[i].topObject.update();

            if (this.patrols[i].shouldBeDestroyedV)
                this.patrols.splice(i, 1);

            // check if the hero touches any Patrol units 
            if (this.mHero.pixelTouches(this.patrols[i].botObject, this.pixelTouchesArray) ||
                this.mHero.pixelTouches(this.patrols[i].topObject, this.pixelTouchesArray) ||
                this.mHero.pixelTouches(this.patrols[i].head, this.pixelTouchesArray)) {

                if ((performance.now() - this.time) >= 50) this.Qactive = true;
                this.time = performance.now();
            }
        }

        // inputs
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.dyePacks.push(new DyePack(this.stwarSprite, this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos()));
        }

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.xPoint = (2000);
            this.yPoint = (Math.random() * this.mCamera.getWCHeight() / 2) + (this.mCamera.getWCHeight() / 2);
            this.patrols.push(new Patrol(this.kMinionPortal, this.stwarSprite, this.stwarSprite, this.xPoint, this.yPoint));
        }

        if (engine.input.isKeyClicked(engine.input.keys.D)) {
            this.xPoint = (1000);
            this.yPoint = (600);
            this.guns.push(new Gun(this.stwarSprite, this.xPoint, this.yPoint));
        }


        for (let i = 0; i < this.guns.length; i++) {
            this.guns[i].update(this.mCamera);

            if (this.guns[i].shouldBeDestroyedV)
                this.guns.splice(i, 1);

       ///.________________________________setAsChild()
            if (this.mHero.pixelTouches(this.guns[i], this.pixelTouchesArray)) {
                this.guns[i].isChild = true; 
                this.mHero.addChild(this.guns[i]);
                this.guns.splice(i, 1);            
             }
        }

        if (engine.input.isKeyClicked(engine.input.keys.Q) || this.Qactive) {
            if (this.shake !== null) {
                this.shake.reStart();
            }
            this.mBounce.reStart();
            this.Qactive = false;
        }

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            if (this.autoSpawnString === "True") {
                this.autoSpawnString = "False"
            } else {
                this.autoSpawnString = "True";
            }
        }
        if (this.autoSpawnString === "True") {
            if (Math.random() < .005) {
                this.xPoint = ((Math.random() * this.mCamera.getWCWidth()) / 2) + (this.mCamera.getWCWidth() / 2);
                this.yPoint = Math.random() * this.mCamera.getWCHeight();
                this.patrols.push(new Patrol(this.kMinionPortal, this.kMinionSprite, this.kMinionSprite, this.xPoint, this.yPoint));
            }
        }

        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.mFocusObj = this.mHero;
            this.mChoice = 'H';
        }

        if (!this.mBounce.done()) {
            let d = this.mBounce.getNext();
            this.mHero.getXform().incXPosBy(d);
        }

        // set the hero and brain cams    
        this.hitCam1.panTo(this.mHero.getXform().getXPos(), this.mHero.getXform().getYPos());

        let msg = "";
        msg += " X=" + engine.input.getMousePosX() + " Y=" + engine.input.getMousePosY() + "      Auto Spawn: " + this.autoSpawnString +
            "      Patrols: " + this.patrols.length + "  DyePacks: " + this.dyePacks.length;
        this.mMsg.setText(msg);

        if (this.mCamera.isMouseInViewport()) {
            let x = this.mCamera.mouseWCX();
            let y = this.mCamera.mouseWCY();

            this.interpolateX.setFinal(x);
            this.interpolateX.update();
            this.mHero.getXform().setXPos(this.interpolateX.get());
            this.interpolateY.setFinal(y);
            this.interpolateY.update();
            this.mHero.getXform().setYPos(this.interpolateY.get());
        }
    }
}

export default MyGame;