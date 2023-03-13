/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!
import Brain from "./objects/brain.js";
import engine from "../engine/index.js";

import Shake from "../engine/utils/shake_vec2.js";
import DyePack from "./objects/dye_pack.js";
import TextureObject from "./objects/texture_object.js";
import Patrol from "./objects/patrol.js";
import Minion from "./objects/minion.js";
import Ship from "./objects/ship.js";
import Gun from "./objects/gun.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.stwarSprite = "assets/result.png";
        this.kBg = "assets/sky.jpg";

        this.tempSTR = "XX";
        // The camera to view the scene
        this.mCamera = null;
        this.pixelTouchesArray = [];
        this.shake = null;

        this.time;
        this.Qactive = false;

        this.xPoint;
        this.yPoint;

        this.randomPosX;
        this.randomPosY;

        this.mBg = null;
        this.mMsg = null;

        // the game objects
        this.mShip = null;
        this.mTest = null;
        this.dyePacks = [];
        this.patrols = [];

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
            1000,                       // width of camera
            [0, 0, 1920, 1080]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);
        // sets the background to gray

        // Large background image
        let bgR = new engine.SpriteRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 3000, 0, 789);
        bgR.getXform().setSize(2000, 600);
        bgR.getXform().setPosition(1000, 600);
        this.mBg = new engine.GameObject(bgR);
        engine.defaultResources.setGlobalAmbientIntensity(5);
        // Objects in the scene

        this.mShip = new Ship(this.stwarSprite);
        
        this.mTest = new engine.GameObject(new engine.SpriteRenderable(this.stwarSprite));
        this.mTest.getXform().setPosition(700, 600);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([1, 1, 1, 1]);
        this.mMsg.getXform().setPosition(20, 0);
        this.mMsg.setTextHeight(25);

        // create objects to simulate various motions 
        this.mBounce = new engine.Oscillate(40.5, 40, 60); // delta, freq, duration  
        this.shake = new Shake(this.mShip.getXform().getXPos(), this.mShip.getXform().getYPos(), 5, 100);
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);

        //this.mRenderComponent.draw(camera);
        this.mShip.draw(camera);
        this.mTest.draw(camera);
        for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].draw(camera);
        }
        for (let i = 0; i < this.patrols.length; i++) {
            this.patrols[i].drawInPatrol(camera);
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
        // update objects
        this.mCamera.update();
        this.mShip.update(this.mCamera, this.dyePacks);
        this.mTest.update();

        // update cannon shots
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
            if (this.mShip.pixelTouches(this.patrols[i].botObject, this.pixelTouchesArray) ||
                this.mShip.pixelTouches(this.patrols[i].topObject, this.pixelTouchesArray) ||
                this.mShip.pixelTouches(this.patrols[i].head, this.pixelTouchesArray)) {

                if ((performance.now() - this.time) >= 50) this.Qactive = true;
                this.time = performance.now();
            }
        }

        // inputs
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.dyePacks.push(new DyePack(this.stwarSprite, this.mShip.getXform().getXPos(), this.mShip.getXform().getYPos()));
        }

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.xPoint = (2000);
            this.yPoint = (Math.random() * this.mCamera.getWCHeight() / 2) + (this.mCamera.getWCHeight() / 2);
            this.patrols.push(new Patrol(this.kMinionPortal, this.stwarSprite, this.stwarSprite, this.xPoint, this.yPoint));
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

        if (!this.mBounce.done()) {
            let d = this.mBounce.getNext();
            this.mShip.getXform().incXPosBy(d);
        }
        
        let msg = "";
        msg += " X=" + engine.input.getMousePosX() + " Y=" + engine.input.getMousePosY() + "      Auto Spawn: " + this.autoSpawnString +
            "      Patrols: " + this.patrols.length + "  DyePacks: " + this.dyePacks.length;
        this.mMsg.setText(msg);

    }
}

export default MyGame;