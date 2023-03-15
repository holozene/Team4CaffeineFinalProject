"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Interpolate from "../../engine/utils/lerp.js";
import DyePack from "./dye_pack.js";
import Gun from "./gun.js";

class Ship extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(700, 600);
        this.mRenderComponent.getXform().setSize(200, 200);
        this.mRenderComponent.setElementPixelPositions(0, 100, 0, 97);

        this.interpolateX = new Interpolate(this.mRenderComponent.getXform().getXPos(), 420, 0.05);
        this.interpolateY = new Interpolate(this.mRenderComponent.getXform().getYPos(), 420, 0.05);
        this.spriteTextureT = spriteTexture;
       this.mTurret;// = new Gun(spriteTexture, 0.1, 0.1, 0);
        //this.mTurret.setParent(this);

        //this.mTurret2 = new Gun(spriteTexture, 0.1, 0.1, 2);
        //this.mTurret2.setParent(this);
        
        // this.mTurret.getXform().setYPos(600);

        this.canon3 = false; 
        this.canonFire = false;
        this.canonSpin = false;
        this.canonType =0;
        this.mTurret = new Gun(this.spriteTextureT, 0.1, 0.1, 0);
        this.mTurret.setParent(this);

        this.dyePacks = [];
        this.fireGun = false;
        this.gunAngle =0;



    }
    addNewGun(type){
       // this.mTurret = new Gun(this.spriteTextureT, 0.1, 0.1, type);
        //this.mTurret.setParent(this);

        
    }

    gunSoot(camera){
        var p1 = {
            x: this.mRenderComponent.getXform().getXPos(),
            y: this.mRenderComponent.getXform().getYPos()
        };      
        let x = 0;
        let y = 0;
        
        if (camera.isMouseInViewport()) {
            x = camera.mouseWCX();
            y = camera.mouseWCY();
        }      
        var p2 = {
            x2: x,
            y2: y
        };
            
        // angle in radians
        this.gunAngle = Math.atan2(p2.y2 - p1.y, p2.x2 - p1.x);
        
        // angle in degrees
        //var angleDeg = Math.atan2(p2.y2 - p1.y, p2.x2 - p1.x) * 180 / Math.PI;
    
    this.dyePacks.push(new DyePack(this.spriteTextureT, this.getXform().getXPos() +20, this.getXform().getYPos()+20 ,  this.gunAngle));  
        
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

            //ship shoot 
   // if (this.canon3) {
        //this.dyePacks.push(new DyePack(this.stwarSprite, this.getXform().getXPos()+20, this.getXform().getYPos() +20, this.gunAngle ));
    //}
     //if(this.canonFire ){
       // this.dyePacks.push(new DyePack(this.stwarSprite, this.getXform().getXPos()+20, this.getXform().getYPos() +20, this.gunAngle));
   // }
     //if(this.canonSpin ){
       // this.dyePacks.push(new DyePack(this.stwarSprite, this.getXform().getXPos()+20, this.getXform().getYPos() +20, this.gunAngle));
        //this.dyePacks.push(new DyePack(this.stwarSprite, this.getXform().getXPos()+20, this.getXform().getYPos(), this.gunAngle ));
    //}
    
       
            this.mTurret.update(x, y);
          
            if(this.fireGun){

               this.gunSoot(camera);
                this.fireGun = false;

            }


         for (let i = 0; i < this.dyePacks.length; i++) {
            this.dyePacks[i].draw(camera);
            this.dyePacks[i].update(camera);
        }
        

       
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
    }

    draw(camera) {
        super.draw(camera);
        // this.mTurret.draw(camera);
        // this.mTest.draw(camera);
    }
}

export default Ship;