/*
 * File: MyGame.js 
 *       This is the logic of our game. 
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!
import engine from "../engine/index.js";

import Shake from "../engine/utils/shake_vec2.js";
import DyePack from "./objects/dye_pack.js";
import DyePackRed from "./objects/dye_pack_red.js";
import Patrol from "./objects/patrol.js";
import Ship from "./objects/ship.js";
import Gun from "./objects/gun.js";
import MyGameMain from "./my_game_main.js";

class MyGame2 extends engine.Scene {
    constructor() {
        super();

        this.stwarSprite = "assets/result.png";
        this.kBg = "assets/star.jpg";

        this.tempSTR = "XX";
        // The camera to view the scene
        this.mCamera = null;
        this.pixelTouchesArray = [];

        this.time;
        this.QActive = false;

        this.xPoint;
        this.yPoint;

        this.mBg = null;
        this.mMsg = null;

        // the game objects
        this.mShip = null;
        this.guns = [];
        this.dyePacks = [];
        this.dyePacksRed = [];
        this.patrols = [];

        this.randomSpawnPosX;
        this.randomSpawnPosY;

        this.numberOfdyePacks = 0;
        this.numberOfPatrolUnits = 0;

        this.autoSpawnString = "True";
    }

    load() {
        engine.texture.load(this.kBg);
        engine.texture.load(this.stwarSprite);
    }

    unload() {
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
        // set the background to grayn
        this.mCamera.setBackgroundColor([0.9, 0.9, 0.9, 1]);

        // Large background image
        let bgR = new engine.SpriteRenderable(this.kBg);
        bgR.setElementPixelPositions(0, 5120, 0, 2880);
        bgR.getXform().setSize(2000, 1000);
        bgR.getXform().setPosition(1000, 600);
        this.mBg = new engine.GameObject(bgR);
        engine.defaultResources.setGlobalAmbientIntensity(4);

        // Objects in the scene
        this.mShip = new Ship(this.stwarSprite);

        this.mMsg = new engine.FontRenderable("Ship auto spawn: key P , Gun auto spawn: key L - Spawn Ship: C -Spawn Gun: H - Shoot:Spacebar");
        this.mMsg.setColor([.1, .1, .1, .1]);
        this.mMsg.getXform().setPosition(550, 350);
        this.mMsg.setTextHeight(15);
    }

    _drawCamera(camera) {
        camera.setViewAndCameraMatrix();
        this.mBg.draw(camera);

        //this.mRenderComponent.draw(camera);
        this.mShip.draw(camera);
        for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].draw(camera);
        }
        for (let i = 0; i < this.dyePacksRed.length; i++) {
            this.dyePacksRed[i].draw(camera);
        }
        for (let i = 0; i < this.patrols.length; i++) {
            this.patrols[i].drawInPatrol(camera);
        }
        for (let i = 0; i < this.guns.length; i++) {
            this.guns[i].drawInGuns(camera);
            
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

        if(engine.input.isKeyClicked(engine.input.keys.Y) === true){
            this.mShip.addNewGun(2);
        }

        
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

       
        for (let i = 0; i < this.dyePacksRed.length; i++) {
            this.dyePacksRed[i].update(this.mCamera);

            if (this.dyePacksRed[i].shouldBeDestroyedV)
                this.dyePacksRed.splice(i, 1);
        }


        // update patrols
        for (let i = 0; i < this.patrols.length; i++) {
            this.patrols[i].update(this.mCamera);
            // this.patrols[i].topObject.update();

          

                if (Math.random() < .01) {               
                                    
                 this.dyePacksRed.push(new DyePackRed(this.stwarSprite,this.patrols[i].getHeadXForm().getXPos() , 
                    this.patrols[i].getHeadXForm().getYPos(), -1 ));            
                  }             

                if (this.patrols[i].shouldBeDestroyedV)
               this.patrols.splice(i, 1);
                
            // check if the hero touches any Patrol units 
            //if (this.mShip.pixelTouches(this.patrols[i].botObject, this.pixelTouchesArray) ||
            //    this.mShip.pixelTouches(this.patrols[i].topObject, this.pixelTouchesArray) ||
            //    this.mShip.pixelTouches(this.patrols[i].head, this.pixelTouchesArray)) {

             //   if ((performance.now() - this.time) >= 50) this.Qactive = true;
             //   this.time = performance.now();
           // }
        }
    


        
        // inputs
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.dyePacks.push(new DyePack(this.stwarSprite, this.mShip.getXform().getXPos(), this.mShip.getXform().getYPos(), 0));
            this.mShip.fireGun = true ;
        }

        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            this.xPoint = (999);
            this.yPoint = (Math.random() * this.mCamera.getWCHeight() / 2) + (this.mCamera.getWCHeight() / 2);
            this.patrols.push(new Patrol(this.stwarSprite, this.stwarSprite, this.stwarSprite, this.xPoint, this.yPoint));
        }

        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.xPoint = (Math.random() * this.mCamera.getWCWidth() / 2) + (this.mCamera.getWCWidth() / 2);
            this.yPoint = (Math.random() * this.mCamera.getWCHeight() / 2) + (this.mCamera.getWCHeight() / 2);
           
            let randomN = Math.random();
            let type = 0;
            if (randomN <= .3)
                type = 0;
            else if (randomN > .3 && randomN <= .7)
                type = 1;
            else
                type = 2;
            
                let tempGun = new Gun(this.stwarSprite, this.xPoint, this.yPoint,type);
            tempGun.setGunSize();
            this.guns.push(tempGun);
          
        }


        for (let i = 0; i < this.guns.length; i++) {
            //this.guns[i].update(this.mCamera);

            if (this.guns[i].shouldBeDestroyedV)
                this.guns.splice(i, 1);

            // if (this.mShip.pixelTouches(this.guns[i], this.pixelTouchesArray)) {
                
            //     this.guns[i].isChild = true; 
            //     //this.mShip.addChild(this.guns[i]);  
            //     //updating the ship about the gun being used 
            //     if(this.guns[i].canon3){
            //      this.mShip.canon3 = true;
            //      this.mShip.canonFire = false;
            //      this.mShip.canonSpin = false;
            //     } 
            //      if(this.guns[i].canonFire ) {
            //         this.mShip.canon3 = false;
            //         this.mShip.canonFire = true;
            //         this.mShip.canonSpin = false;
            //     }
            //     if(this.guns[i].canonSpin ) {
            //         this.mShip.canon3 = false;
            //      this.mShip.canonFire = false;
            //      this.mShip.canonSpin = true;
            //     }
               
                  
            //     this.guns.splice(i, 1);            
      
            //  }
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
                this.xPoint = (999);
             this.yPoint = (Math.random() * this.mCamera.getWCHeight() / 2) + (this.mCamera.getWCHeight() / 2);
            this.patrols.push(new Patrol(this.stwarSprite, this.stwarSprite, this.stwarSprite, this.xPoint, this.yPoint));
            }
        }

    }
   
    next() { 
        super.next();  // this must be called!

        // next scene to run
          
        let nextLevel = new MyGameMain();  // next level to be loaded
        nextLevel.start();
    }
}

export default MyGame2;