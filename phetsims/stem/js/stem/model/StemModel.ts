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

  public mass: number;

  public constructor(
    public gravity: number,
    mass: number = 1,
    public airResistanceCoefficient: number = 0.5
  ) {
    this.mass = mass;
  }

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

  // Reset nhưng cập nhật lại initialY theo vị trí mới
  public softResetAt(y: number): void {
    this.velocity = 0;
    this.vMax = 0;
    this.fallingTime = 0;
    this.isFalling = false;
    this.lastHeight = 0;
    this.hasLanded = false;
    this.setInitialPosition(y);
  }

  // Reset về đúng initialY ban đầu
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
    
    let acceleration: number;

    if (this.airResistanceEnabled) {
      const drag = this.airResistanceCoefficient * this.velocity * Math.abs(this.velocity);
      acceleration = this.gravity - drag / this.mass;
    } else {
      acceleration = this.gravity;
    }

    // Cập nhật vị trí và vận tốc
    this.position += this.velocity * dt + 0.5 * acceleration * dt * dt;
    this.velocity += acceleration * dt;

    // Cộng dồn thời gian rơi thực tế
    this.fallingTime += dt;

    // Cập nhật vận tốc cực đại
    this.vMax = Math.max(this.vMax, this.velocity);

    // Kiểm tra chạm đất
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
    const gravity = 980; // px/s²
    // Vật A nhẹ (ví dụ mass = 1)
    this.objectA = new FallingObject(gravity, 1, 2.5); 

    // Vật B nặng hơn (ví dụ mass = 3)
    this.objectB = new FallingObject(gravity, 3, 2.5); 

    // Xử lý khi đổi chế độ
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

  // reset riêng objectA, giữ nguyên initialY hiện tại
  public resetObjectA(): void {
    this.objectA.softResetAt(this.objectA.position);
  }

  // reset riêng objectB, giữ nguyên initialY hiện tại
  public resetObjectB(): void {
    this.objectB.softResetAt(this.objectB.position);
  }

  public step(dt: number): void {
    this.objectA.step(dt);
    this.objectB.step(dt);
  }
}



stem.register( 'StemModel', StemModel );