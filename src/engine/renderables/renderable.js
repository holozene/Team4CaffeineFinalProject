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
        this.mParentXform = null; // the default transform will not affect the object, but if it is overridden, this object will be offset by the transform
    }

    draw(camera) {
        let gl = glSys.get();
        let matrix = null;
        if (this.mParentXform === null) {
            matrix = this.mXform.getTRSMatrix();
        }
        else {
            matrix = mat4.create();
            matrix = this.getGlobalXform().getTRSMatrix();
        }
        this.mShader.activate(this.mColor, matrix, camera.getCameraMatrix());  // always activate the shader first!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    getGlobalXform() {
        let transform = new Transform();
        let zero = vec2.fromValues(0, 0);
        let pos = vec2.fromValues(
            this.mXform.getXPos() * this.mParentXform.getWidth(),
            this.mXform.getYPos() * this.mParentXform.getHeight());
        vec2.rotateWRT(pos, pos, this.mParentXform.getRotationInRad(), zero)
        transform.setPosition(
            this.mParentXform.getXPos() + pos[0],
            this.mParentXform.getYPos() + pos[1]);
        transform.setZPos(this.mParentXform.getZPos() + this.mXform.getZPos());
        transform.setSize(
            this.mParentXform.getWidth() * this.mXform.getWidth(),
            this.mParentXform.getHeight() * this.mXform.getHeight());
        transform.setRotationInRad(this.mParentXform.getRotationInRad() +  this.mXform.getRotationInRad());
        return transform;
    }

    getXform() {
        return this.mXform;
    }
    getParentXform() {
        return this.mParentXform;
    }
    setColor(color) { this.mColor = color; }
    getColor() { return this.mColor; }

    isChild() {
        return this.mParentXform !== null;
    }
    setParentXform(xform) {
        this.mParentXform = xform;
        // debugger
    }
    clearParentXform() {
        this.mParentXform = null;
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