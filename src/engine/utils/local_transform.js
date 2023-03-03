/*
 * File: transform.js 
 *
 * Encapsulates the matrix transformation functionality, meant to work with
 * Renderable
 */
"use strict";

import Transform from "./transform.js";

class LocalTransform {

    constructor(globalTransform, parent, recalculate = false) {
        super();
        this.mParent = parent; // the transform that this is relative to
        this.mGlobalTransform = globalTransform; // the transform that holds the absolute position of the object
        
        if(!this.mGlobalTransform) console.log(this.mGlobalTransform);
        if (recalculate) {
            console.log("test");
            this.mGlobalTransform.mPosition[0] = this.getXPos();
            this.mGlobalTransform.mPosition[1] = this.getYPos();
        } else {
            console.log("test2");
            // this.setPosition(this.mGlobalTransform.getPosition());
            this.mGlobalTransform.setXPos(this.mParent.getXPos() + this.mGlobalTransform.getXPos());
            this.mGlobalTransform.setYPos(this.mParent.getYPos() + this.mGlobalTransform.getYPos());
        }
        this.mScale = this.mGlobalTransform.getSize();     // this is the width (x) and height (y)
        this.mZ = this.mGlobalTransform.get3DPosition();   // must be a positive number, a larger value is closer to the eye
        this.mRotationInRad = this.mGlobalTransform.getRotationInRad(); // in radians!
    }

    cloneTo(aXform) {
        aXform.mPosition = vec2.clone(this.mPosition);
        aXform.mScale = vec2.clone(this.mScale);
        aXform.mZ = this.mZ;
        aXform.mRotationInRad = this.mRotationInRad;
    }

    setPosition(xPos, yPos) { this.setXPos(xPos); this.setYPos(yPos); }
    getPosition() { return vec2.fromValues(this.getXPos(), this.getYPos()); }
    get3DPosition() { return vec3.fromValues(this.getXPos(), this.getYPos(), this.getZPos()); }
    getXPos() { return this.mPosition[0] - this.mParent.getXPos(); } // when getting child position, calculate it using parent position
    setXPos(xPos) {
        this.mPosition[0] = xPos;
        this.mGlobalTransform.setXPos(this.mParent.getXPos() + xPos); // the global location of this object = 
        console.log(this.mGlobalTransform.getXPos());
    }
    incXPosBy(delta) {
        this.mPosition[0] += delta;
        this.mGlobalTransform.incXPosBy(delta);
    }
    getYPos() { return this.mPosition[1] - this.mParent.getYPos(); }
    setYPos(yPos) {
        this.mPosition[1] = yPos;
        this.mGlobalTransform.incYPosBy(this.mParent.getYPos() + yPos);
    }
    incYPosBy(delta) {
        this.mPosition[1] += delta;
        this.mGlobalTransform.incYPosBy(delta);
    }
    setZPos(d) { this.mZ = d; }
    getZPos() { return this.mZ; }
    incZPosBy(delta) { this.mZ += delta; }

    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    }
    getSize() { return this.mScale; }
    incSizeBy(delta) {
        this.incWidthBy(delta);
        this.incHeightBy(delta);
    }
    getWidth() { return this.mScale[0]; }
    setWidth(width) { this.mScale[0] = width; }
    incWidthBy(delta) { this.mScale[0] += delta; }
    getHeight() { return this.mScale[1]; }
    setHeight(height) { this.mScale[1] = height; }
    incHeightBy(delta) { this.mScale[1] += delta; }
    setRotationInRad(rotationInRadians) {
        this.mRotationInRad = rotationInRadians;
        while (this.mRotationInRad > (2 * Math.PI)) {
            this.mRotationInRad -= (2 * Math.PI);
        }
    }
    setRotationInDegree(rotationInDegree) {
        this.setRotationInRad(rotationInDegree * Math.PI / 180.0);
    }
    incRotationByDegree(deltaDegree) {
        this.incRotationByRad(deltaDegree * Math.PI / 180.0);
    }
    incRotationByRad(deltaRad) {
        this.setRotationInRad(this.getRotationInRad() + deltaRad);
    }
    getRotationInRad() { return this.mRotationInRad; }
    getRotationInDegree() { return this.mRotationInRad * 180.0 / Math.PI; }

    // returns the matrix the concatenates the transformations defined
    getTRSMatrix() {
        // Creates a blank identity matrix
        let matrix = mat4.create();

        // The matrices that WebGL uses are transposed, thus the typical matrix
        // operations must be in reverse.

        // Step A: compute translation, for now z is the height
        mat4.translate(matrix, matrix, this.get3DPosition());
        // Step B: concatenate with rotation.
        mat4.rotateZ(matrix, matrix, this.getRotationInRad());
        // Step C: concatenate with scaling
        mat4.scale(matrix, matrix, vec3.fromValues(this.getWidth(), this.getHeight(), 1.0));

        return matrix;
    }
}

export default LocalTransform;