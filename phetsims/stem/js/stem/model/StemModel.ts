// Copyright 2025, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author anhnt02hp
 */

import TModel from '../../../../joist/js/TModel.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import stem from '../../stem.js';

type SelfOptions = {
  //TODO add options that are specific to StemModel here
};

type StemModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class StemModel implements TModel {
  // Thuộc tính trạng thái của vật thể
  public position: number; // vị trí theo trục Y
  public velocity: number; // vận tốc
  public vMax: number = 0;
  public fallingTime: number; // thời gian rơi
  public readonly gravity: number = 1000; // gia tốc trọng trường (px/s²)
  public groundY: number; // vị trí mặt đất theo Y
  public isFalling: boolean = false;
  private initialY: number = 0; //thêm vị trí ban đầu để tính t

  public constructor( providedOptions: StemModelOptions ) {
    this.position = 0;
    this.velocity = 0;
    this.fallingTime = 0;
    this.groundY = 0; // sẽ cập nhật từ View sau
    this.isFalling = false;
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
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.isFalling ) {
      this.position += this.velocity * dt + 0.5 * this.gravity * dt * dt;
      this.velocity += this.gravity * dt;
      this.fallingTime = Math.sqrt( 2 * ( this.position - this.initialY ) / this.gravity );
      this.vMax = Math.max( this.vMax, this.velocity );
      
      // Nếu chạm đất thì dừng lại
      if ( this.position >= this.groundY ) {
        this.position = this.groundY;
        this.velocity = 0;
        this.isFalling = false;
      }
    }
  }
}

stem.register( 'StemModel', StemModel );