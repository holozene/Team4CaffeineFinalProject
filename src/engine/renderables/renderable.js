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
            matrix = this._addTransforms(this.mParentXform, this.mXform).getTRSMatrix();
        }
        this.mShader.activate(this.mColor, matrix, camera.getCameraMatrix());  // always activate the shader first!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    //todo: might need to tweak this method based on desired inheritances
    _addTransforms(parent, child) {
        let transform = new Transform();
        transform.setPosition(
            parent.getXPos() + child.getXPos(),
            parent.getYPos() + child.getYPos());
        transform.setZPos(parent.getZPos() + child.getZPos());
        transform.setSize(
            parent.getWidth() * child.getWidth(),
            parent.getHeight() * child.getHeight());
        transform.setRotationInRad(/*parent.getRotationInRad() + */ child.getRotationInRad());
        return transform;
    }

    getXform() {
        // let xform = new Transform();

        //xform.setTRSMatrix(mat4);
        // if (this.mParentXform !== null) {
        //     return this.mParentXform;
        // }
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