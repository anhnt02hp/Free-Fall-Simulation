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

export enum FreefallMode {
  ONE_OBJECT,
  TWO_OBJECTS
}

export default class StemModel implements TModel {

  // Chế độ rơi và hiển thị vật thể
  public freefallModeProperty = new Property<FreefallMode>( FreefallMode.ONE_OBJECT );
  public objectAVisibleProperty = new Property<boolean>( true );
  public objectBVisibleProperty = new Property<boolean>( false );

  // Thuộc tính trạng thái của vật thể
  public position: number; // vị trí theo trục Y
  public velocity: number; // vận tốc
  public vMax: number = 0;
  public fallingTime: number; // thời gian rơi
  public readonly gravity: number = 1000; // gia tốc trọng trường (px/s²)
  public groundY: number; // vị trí mặt đất theo Y
  public isFalling: boolean = false;
  private initialY: number = 0; //thêm vị trí ban đầu để tính t
  public lastHeight: number = 0;
  private hasLanded: boolean = false;

  public airResistanceEnabled: boolean = false; // bật/tắt lực cản
  public airResistanceCoefficient: number = 2.5; // hệ số lực cản (tùy chỉnh)

  // Bật/tắt lực cản
  public setAirResistance(enabled: boolean): void {
    this.airResistanceEnabled = enabled;
  }

  public constructor( providedOptions: StemModelOptions ) {
    this.position = 0;
    this.velocity = 0;
    this.fallingTime = 0;
    this.groundY = 0; // sẽ cập nhật từ View sau
    this.isFalling = false;

    // Link chế độ rơi với hiển thị vật thể
    this.freefallModeProperty.link( mode => {
      if ( mode === FreefallMode.ONE_OBJECT ) {
        this.objectAVisibleProperty.value = true;
        this.objectBVisibleProperty.value = false;
      }
      else {
        this.objectAVisibleProperty.value = true;
        this.objectBVisibleProperty.value = true;
      }
    });
  }

  // Gán vị trí ban đầu từ View
  public setInitialPosition( y: number ): void {
    this.position = y;
    this.initialY = y;
  }

  public setGroundY( y: number ): void {
    this.groundY = y;
  }

  public startFalling(): void {
    this.isFalling = true;
    this.hasLanded = false;
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.velocity = 0;
    this.fallingTime = 0;
    this.fallingTime = 0;
    this.isFalling = false;
    this.vMax = 0;
    this.lastHeight = 0;
    this.hasLanded = false;
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.isFalling ) {
      if ( this.airResistanceEnabled ) {
        // Lực cản tuyến tính: a = g - k*v
        const drag = this.airResistanceCoefficient * this.velocity;
        this.position += this.velocity * dt + 0.5 * ( this.gravity - drag ) * dt * dt;
        this.velocity += ( this.gravity - drag ) * dt;
      }
      else {
        // Không có lực cản
        this.position += this.velocity * dt + 0.5 * this.gravity * dt * dt;
        this.velocity += this.gravity * dt;
      }

      // Giữ nguyên công thức tính t
      this.fallingTime = Math.sqrt(
        2 * ( this.position - this.initialY ) / this.gravity
      );

      this.vMax = Math.max( this.vMax, this.velocity );

      // Chạm đất
      if ( this.position >= this.groundY ) {
        this.position = this.groundY;
        this.velocity = 0;
        this.isFalling = false;

        if ( !this.hasLanded ) {
          this.lastHeight = this.groundY - this.initialY;
          this.hasLanded = true;
        }
      }
    }
  }
}

stem.register( 'StemModel', StemModel );