// Copyright 2025, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author anhnt02hp
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Property from '../../../../axon/js/Property.js';
import stem from '../../stem.js';

type SelfOptions = {
  //TODO add options that are specific to StemModel here
};

type StemModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class FallingObject {
  public position = 0;
  public velocity = 0;
  public vMax = 0;
  public fallingTime = 0;
  public isFalling = false;
  public lastHeight = 0;
  private hasLanded = false;
  private initialY = 0;

  public groundY = 0;
  public airResistanceEnabled = false;

  public constructor(
    public gravity: number,
    public airResistanceCoefficient: number = 2.5
  ) {}

  public setInitialPosition(y: number): void {
    this.position = y;
    this.initialY = y;
  }

  public setGroundY(y: number): void {
    this.groundY = y;
  }

  public setAirResistance(enabled: boolean): void {
    this.airResistanceEnabled = enabled;
  }

  public startFalling(): void {
    this.isFalling = true;
    this.hasLanded = false;
  }

  public softResetAt(y: number): void {
    this.velocity = 0;
    this.vMax = 0;
    this.fallingTime = 0;
    this.isFalling = false;
    this.lastHeight = 0;
    this.setInitialPosition(y); // cũng cập nhật initialY = y
  }

  public reset(): void {
    this.velocity = 0;
    this.fallingTime = 0;
    this.isFalling = false;
    this.vMax = 0;
    this.lastHeight = 0;
    this.hasLanded = false;
    this.position = this.initialY;
  }

  public step(dt: number): void {
    if (!this.isFalling) return;

    if (this.airResistanceEnabled) {
      const drag = this.airResistanceCoefficient * this.velocity;
      this.position += this.velocity * dt + 0.5 * (this.gravity - drag) * dt * dt;
      this.velocity += (this.gravity - drag) * dt;
    } else {
      this.position += this.velocity * dt + 0.5 * this.gravity * dt * dt;
      this.velocity += this.gravity * dt;
    }

    this.fallingTime = Math.sqrt(
      2 * (this.position - this.initialY) / this.gravity
    );
    this.vMax = Math.max(this.vMax, this.velocity);

    if (this.position >= this.groundY) {
      this.position = this.groundY;
      this.velocity = 0;
      this.isFalling = false;

      if (!this.hasLanded) {
        this.lastHeight = this.groundY - this.initialY;
        this.hasLanded = true;
      }
    }
  }
}

export enum FreefallMode {
  ONE_OBJECT,
  TWO_OBJECTS
}

export default class StemModel implements TModel {
  public freefallModeProperty = new Property<FreefallMode>(FreefallMode.ONE_OBJECT);
  public objectAVisibleProperty = new Property<boolean>(true);
  public objectBVisibleProperty = new Property<boolean>(false);

  public objectA: FallingObject;
  public objectB: FallingObject;

  public constructor(options: StemModelOptions) {
    const gravity = 1000; // px/s²
    this.objectA = new FallingObject(gravity);
    this.objectB = new FallingObject(gravity);

    this.freefallModeProperty.link(mode => {
      if (mode === FreefallMode.ONE_OBJECT) {
        this.objectAVisibleProperty.value = true;
        this.objectBVisibleProperty.value = false;
      } else {
        this.objectAVisibleProperty.value = true;
        this.objectBVisibleProperty.value = true;
      }
    });
  }

  public setGroundY(y: number): void {
    this.objectA.setGroundY(y);
    this.objectB.setGroundY(y);
  }

  public setAirResistance(enabled: boolean): void {
    this.objectA.setAirResistance(enabled);
    this.objectB.setAirResistance(enabled);
  }

  public reset(): void {
    // reset cả hai để giữ tương thích với TModel
    this.objectA.reset();
    this.objectB.reset();
  }

  // reset riêng objectA
  public resetObjectA(): void {
    this.objectA.reset();
  }

  // reset riêng objectB
  public resetObjectB(): void {
    this.objectB.reset();
  }

  public step(dt: number): void {
    this.objectA.step(dt);
    this.objectB.step(dt);
  }
}


stem.register( 'StemModel', StemModel );