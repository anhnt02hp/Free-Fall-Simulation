// Copyright 2025, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author anhnt02hp
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import StemConstants from '../../common/StemConstants.js';
import stem from '../../stem.js';
import StemModel from '../model/StemModel.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Line from '../../../../scenery/js/nodes/Line.js';

type SelfOptions = {
 //TODO add options that are specific to StemScreenView here
};

type StemScreenViewOptions = SelfOptions & ScreenViewOptions;

const radius = 20;

export default class StemScreenView extends ScreenView {
  private readonly draggableCircleInitialPosition = { x: 0, y: 0 };
  private readonly dragCircle: Circle;

  public constructor( model: StemModel, providedOptions: StemScreenViewOptions ) {

    const options = optionize<StemScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );
    super( options );

    //=============UI CONSTANT===========================
    const screenLeft = this.layoutBounds.left;
    const screenRight = this.layoutBounds.right;
    const screenTop = this.layoutBounds.top;
    const screenBottom = this.layoutBounds.bottom;

    const screenWidth = screenRight - screenLeft;
    const screenHeight = screenBottom - screenTop;
    //===================================================

    // ================== BACKGROUND SKY AND GROUND ======================
    const skyHeight = screenHeight * 0.8;
    const groundHeight = screenHeight * 0.2;
    // Bầu trời (80% chiều cao màn hình)
    const sky = new Rectangle( 0, 0, screenWidth, skyHeight, {
      fill: '#dbf3fa',
      left: screenLeft,
      top: screenTop
    } );
    this.addChild( sky );

    // Mặt đất (20% chiều cao màn hình)
    const ground = new Rectangle( 0, 0, screenWidth, groundHeight, {
      fill: '#77dd77',
      left: screenLeft,
      top: screenTop + skyHeight
    } );
    this.addChild( ground );
    // ===================================================================
    
    // Vị trí ban đầu (đặt bóng nằm giữa phần mặt đất)
    const initialX = this.layoutBounds.centerX;
    const initialY = this.layoutBounds.top + skyHeight + groundHeight / 2;

    //=================CREATE REFERENCE LINE============================
    const referenceLine = new Line(
      screenLeft, initialY,   // điểm đầu của đường
      screenRight, initialY,  // điểm cuối của đường
      {
        stroke: 'brown',
        lineWidth: 2
      }
    );
    this.addChild( referenceLine );
    //=================================================================

    //=================CREATE CIRCLE============================
    // Lưu vị trí ban đầu vào biến instance
    this.draggableCircleInitialPosition = new Vector2( initialX, initialY );

    const dragCircle = new Circle( radius, {
      fill: 'red',
      centerX: initialX,
      centerY: initialY - radius,
      cursor: 'pointer'
    });

    // Vùng kéo cho phép: từ trên cùng của bầu trời đến initialY, trong vùng ngang layout
    const dragBounds = Bounds2.rect(
      screenLeft,
      screenTop,
      screenRight,
      initialY
    );

    // Tạo DragListener với closure truy cập dragCircle
    const dragListener = new DragListener( {
      translateNode: true,
      
      drag: ( event, listener ) => {
        // Giới hạn kéo theo X
        dragCircle.centerX = Math.max(
          dragBounds.minX + radius,
          Math.min( dragBounds.maxX - radius, dragCircle.centerX )
        );

        // Giới hạn kéo theo Y (trên: sky top, dưới: initialY)
        dragCircle.centerY = Math.max(
          dragBounds.minY + radius,
          Math.min( dragBounds.maxY - radius, dragCircle.centerY )
        );
      }
    } );


    
    dragCircle.addInputListener( dragListener );
    this.dragCircle = dragCircle;
    this.addChild( dragCircle );
    //===========================================================

    //===============RESET BUTTON================================
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - StemConstants.SCREEN_VIEW_X_MARGIN + 100,
      bottom: this.layoutBounds.maxY - StemConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );
    //=============================================================
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    //======RESET CIRCLE POSITION===================================
    this.dragCircle.centerX = this.draggableCircleInitialPosition.x;
    this.dragCircle.centerY = this.draggableCircleInitialPosition.y - radius;
    //==============================================================
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    //TODO
  }
}

stem.register( 'StemScreenView', StemScreenView );