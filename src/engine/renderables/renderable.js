/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict";

import * as glSys from "../core/gl.js";
import Transform from "../utils/transform.js";
import * as shaderResources from "../core/shader_resources.js";

class Renderable {
    constructor() {
        this.mShader = shaderResources.getConstColorShader();  // get the constant color shader
        this.mXform = new Transform(); // transform that moves this object around
        this.mColor = [1, 1, 1, 1];    // color of pixel
        this.mParentXform = new Transform(); // the default transform will not affect the object, but if it is overridden, this object will be offset by the transform
        this.mChildren = 1;
        this.isChild = false;
        this.test = 0;
    }

    draw(camera) {
        let gl = glSys.get();
        // todo: for efficency we could by default set mParentXform to null and only perform this math if necessary
        let matrix = mat4.create()
        mat4.multiply(matrix, this.mParentXform.getTRSMatrix(), this.mXform.getTRSMatrix())
        this.mShader.activate(this.mColor, matrix, camera.getCameraMatrix());  // always activate the shader first!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }


     increaseChildren() {
         if (this.mChildren == 0) {    
         }
         
         this.mChildren++;
     }
     decreaseChildren() {
         this.mChildren--;
     }

   
    getXform() {
         if(!this.mParentXform) return this.mXform;
         let xform = new Transform();
         
         //xform.setTRSMatrix(mat4);
         if (this.mChildren > 0) {
             return this.mParentXform
         }
        return this.mXform;
    }
    getParentXform() { 
        this.mChildren++;
        return this.mParentXform;
    
    }
    setColor(color) { this.mColor = color; }
    getColor() { return this.mColor; }
    
   
     getPerentingStatus(){
         return this.ischild; 
     }
    setAsChild(){
        this.ischild = true; 
     }
     setParentXform(mXform){   
         this.mXform = mXform;
    }


    swapShader(s) {
        let out = this.mShader;
        this.mShader = s;
        return out;
    }

    // this is private/protected
    _setShader(s) {
        this.mShader = s;
    }
}

export default Renderable;