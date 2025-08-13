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
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TextPushButton from '../../../../sun/js/buttons/TextPushButton.js';
import Property from '../../../../axon/js/Property.js';
import FreefallModeRadioButtonGroup, { FreefallMode } from './FreefallModeRadioButtonGroup.js';

type SelfOptions = {
 //TODO add options that are specific to StemScreenView here
};

type StemScreenViewOptions = SelfOptions & ScreenViewOptions;

const radius = 15;

export default class StemScreenView extends ScreenView {
  private readonly model: StemModel;
  private readonly draggableCircleInitialPosition = { x: 0, y: 0 };
  private readonly dragCircle: Circle;

  private readonly draggableSquareInitialPosition = { x: 0, y: 0 };
  private readonly dragSquare: Rectangle;
  private readonly sText: Text;
  private hText!: Text;
  private vText!: Text;
  private vmaxText!: Text;
  private tText!: Text;

  public constructor( model: StemModel, providedOptions: StemScreenViewOptions ) {

    const options = optionize<StemScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( options );
    this.model = model;

    //Check drag or not
    let wasDragged = false;

    //=============UI CONSTANT===========================
    const screenLeft = this.layoutBounds.left;
    const screenRight = this.layoutBounds.right;
    const screenTop = this.layoutBounds.top;
    const screenBottom = this.layoutBounds.bottom;

    const screenWidth = screenRight - screenLeft;
    const screenHeight = screenBottom - screenTop;
    const skyHeight = screenHeight * 0.95;
    const groundHeight = screenHeight * 0.05;
    //===================================================

    // Vị trí ban đầu (đặt object nằm giữa phần mặt đất)
    const initialX = this.layoutBounds.centerX;
    const initialY = this.layoutBounds.top + skyHeight + groundHeight / 100;

    // ================== BACKGROUND SKY AND GROUND ======================
    // Bầu trời (95% chiều cao màn hình)
    const sky = new Rectangle( 0, 0, screenWidth, skyHeight, {
      fill: '#dbf3fa',
      left: screenLeft,
      top: screenTop
    } );
    this.addChild( sky );

    // Mặt đất (5% chiều cao màn hình)
    const ground = new Rectangle( 0, 0, screenWidth, groundHeight, {
      fill: '#77dd77',
      left: screenLeft,
      top: screenTop + skyHeight
    } );
    this.addChild( ground );
    // ===================================================================

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

    //==========INFORMATION BOX=====================================
    const rectWidth = 220;
    const rectHeight = 200;
    const cornerRadius = 10; // độ bo tròn của góc

    // Góc trên bên phải => x là sát mép phải - rectWidth, y là top
    const rectX = screenRight - rectWidth - 10;
    const rectY = screenTop + 10;

    const myRoundedRect = new Rectangle(
      rectX, rectY,
      rectWidth, rectHeight,
      {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        cornerRadius: cornerRadius
      }
    );

    this.addChild( myRoundedRect );

    //============TITLEBOX============================
    const titleText = new Text('FREE-FALL INFORMATION', {
      font: new PhetFont({ size: 16, weight: 'bold' }),
      fill: 'black'
    });
    titleText.left = rectX + 10;
    titleText.top = rectY + 10;
    this.addChild(titleText);

    //============THÊM TEXT HIỂN THỊ s =======================
    this.sText = new Text('s = 0.0 m', {
      font: new PhetFont( 18 ),
      fill: 'black'
    });
    // Căn trái cùng titleText
    this.sText.left = titleText.left;
    // Cách titleText 30px để không đụng nhau
    this.sText.top = titleText.bottom + 10;
    this.addChild(this.sText);

    //=============THÊM TEXT HIỂN THỊ h ============
    this.hText = new Text('h = 0.0 m', {
      font: new PhetFont( 18 ),
      fill: 'black'
    });
    this.hText.left = titleText.left;
    this.hText.top = this.sText.bottom + 5;
    this.addChild(this.hText);

    //=============THÊM TEXT HIỂN THỊ v ============
    this.vText = new Text('v = 0.0 m/s', {
      font: new PhetFont( 18 ),
      fill: 'black'
    });
    this.vText.left = titleText.left;
    this.vText.top = this.hText.bottom + 5;
    this.addChild(this.vText);

    //=============THÊM TEXT HIỂN THỊ vmax ============
    this.vmaxText = new Text('vmax = 0.0 m/s', {
      font: new PhetFont( 18 ),
      fill: 'black'
    });
    this.vmaxText.left = titleText.left;
    this.vmaxText.top = this.vText.bottom + 5;
    this.addChild(this.vmaxText);

    //=============THÊM TEXT HIỂN THỊ t ============
    this.tText = new Text('t = 0.0 s', {
      font: new PhetFont( 18 ),
      fill: 'black'
    });
    this.tText.left = titleText.left;
    this.tText.top = this.vmaxText.bottom + 5;
    this.addChild(this.tText);    

    //===============================================================

    //=====================AIR RESISTANCE============================
    const airButtonLabelProperty = new Property( 'Air Resistance: OFF' );

    const airToggleButton = new TextPushButton( airButtonLabelProperty, {
      font: new PhetFont( 14 ),
      baseColor: '#f4c542',
      listener: () => {
        const newState = !this.model.airResistanceEnabled;
        this.model.setAirResistance( newState );
        airButtonLabelProperty.value = `Air Resistance: ${newState ? 'ON' : 'OFF'}`;
      }
    });

    // Đặt vị trí nút (ví dụ bên dưới ô thông tin)
    airToggleButton.left = rectX;
    airToggleButton.top = myRoundedRect.bottom + 10;
    this.addChild( airToggleButton );
    //==================================================================

    // ================= MODE RADIO BUTTON (1 vật / 2 vật) =================
    const freefallModeProperty = new Property<FreefallMode>( FreefallMode.ONE_OBJECT );

    const modeRadioGroup = new FreefallModeRadioButtonGroup( freefallModeProperty );
    modeRadioGroup.left = airToggleButton.left;
    modeRadioGroup.top = airToggleButton.bottom + 10;

    this.addChild( modeRadioGroup );

    // Lắng nghe khi đổi chế độ để cập nhật model
    freefallModeProperty.link( mode => {
      //this.model.setFreefallMode( mode ); // bạn sẽ cần viết hàm này trong StemModel
    });

    //=================CREATE CIRCLE============================
    // Lưu vị trí ban đầu vào biến instance
    this.draggableCircleInitialPosition = new Vector2( initialX, initialY );

    // Gửi vị trí ban đầu và mặt đất cho Model
    this.model.setInitialPosition( initialY - radius );
    this.model.setGroundY( initialY - radius); // Mặt đất là tại initialY

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

      start: () => {
        wasDragged = false; // reset mỗi lần bắt đầu
        this.model.reset();
      },

      drag: () => {
        wasDragged = true;

        // cập nhật vị trí
        if ( !this.model.isFalling ) {
          dragCircle.centerX = Math.max(
            dragBounds.minX + radius,
            Math.min( dragBounds.maxX - radius, dragCircle.centerX )
          );
          dragCircle.centerY = Math.max(
            dragBounds.minY + radius,
            Math.min( dragBounds.maxY - radius, dragCircle.centerY )
          );
          this.model.setInitialPosition( dragCircle.centerY );
        }
      },

      end: () => {
        this.model.setInitialPosition( dragCircle.centerY );
        // this.model.startFalling();
      }
    } );

    dragCircle.addInputListener( dragListener );

    dragCircle.addInputListener( {
      up: event => {
        if ( !wasDragged && !this.model.isFalling ) {
          this.model.setInitialPosition( dragCircle.centerY );
          this.model.startFalling();
        }
      }
    } );

    this.dragCircle = dragCircle;
    this.addChild( dragCircle );
    //===========================================================

    //=================CREATE SQUARE============================
    this.draggableSquareInitialPosition = new Vector2( initialX + radius + 50, initialY );

    const dragSquare = new Rectangle(
      Bounds2.rect(0, 0, radius * 2, radius * 2),
      {
        fill: 'blue',
        centerX: initialX + radius + 50,
        centerY: initialY - radius,
        cursor: 'pointer'
      }
    );

    const dragSquareBounds = Bounds2.rect(
      screenLeft,
      screenTop,
      screenRight,
      initialY
    );

    const dragSquareListener = new DragListener( {
      translateNode: true,

      start: () => {
        wasDragged = false;
        this.model.reset();
      },

      drag: () => {
        wasDragged = true;

        if ( !this.model.isFalling ) {
          dragSquare.centerX = Math.max(
            dragSquareBounds.minX + radius,
            Math.min( dragSquareBounds.maxX - radius, dragSquare.centerX )
          );
          dragSquare.centerY = Math.max(
            dragSquareBounds.minY + radius,
            Math.min( dragSquareBounds.maxY - radius, dragSquare.centerY )
          );
          this.model.setInitialPosition( dragSquare.centerY );
        }
      },

      end: () => {
        this.model.setInitialPosition( dragSquare.centerY );
      }
    });

    dragSquare.addInputListener( dragSquareListener );

    dragSquare.addInputListener( {
      up: event => {
        if ( !wasDragged && !this.model.isFalling ) {
          this.model.setInitialPosition( dragSquare.centerY );
          this.model.startFalling();
        }
      }
    });

    this.dragSquare = dragSquare;
    this.addChild( dragSquare );
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

    //======RESET SQUARE POSITION================================
    this.dragSquare.centerX = this.draggableSquareInitialPosition.x;
    this.dragSquare.centerY = this.draggableSquareInitialPosition.y - radius;

    // Cập nhật lại model
    this.model.setInitialPosition( this.dragCircle.centerY );
    this.model.setGroundY( this.draggableCircleInitialPosition.y - radius ); 
    this.model.reset();
    //==============================================================
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    this.model.step( dt );

    // Cập nhật vị trí hình tròn từ model
    this.dragCircle.centerY = this.model.position;
    // Cập nhật vị trí hình vuông từ model
    this.dragSquare.centerY = this.model.position;

    // ==================== CẬP NHẬT GIÁ TRỊ s ======================
    const referenceY = this.draggableCircleInitialPosition.y - radius;
    const currentY = this.dragCircle.centerY;
    const s = referenceY - currentY;

    // Giả sử mỗi pixel là 1 đơn vị (hoặc bạn có thể chia cho scale nào đó để ra mét)
    const sMeters = ( s / 100 ).toFixed( 2 ); // ví dụ: 100px = 1m
    this.sText.string = `s = ${sMeters} m`;

    //======================Cập nhât giá trị h=======================
    if ( this.model.isFalling ) {
      const h = this.model.groundY - this.dragCircle.centerY;
      this.model.lastHeight = h; // lưu lại trong lúc rơi
      const hMeters = ( h / 100 ).toFixed( 2 );
      this.hText.string = `h = ${hMeters} m`;
    }
    else {
      const hMeters = ( this.model.lastHeight / 100 ).toFixed( 2 );
      this.hText.string = `h = ${hMeters} m`;
    }

    //======================CẬP NHẬT GIÁ TRỊ v =======================
    // Lấy vận tốc từ model
    const v = this.model.velocity;
    const vMeters = ( v / 100 ).toFixed( 2 ); // giả sử 100px = 1m
    this.vText.string = `v = ${vMeters} m/s`;

    //======================CẬP NHẬT GIÁ TRỊ vmax =======================
    // Lấy vận tốc từ model
    const vmax = this.model.vMax;
    const vmaxMeters = ( vmax / 100 ).toFixed( 2 ); // giả sử 100px = 1m
    this.vmaxText.string = `vmax = ${vmaxMeters} m/s`;

    //======================CẬP NHẬT GIÁ TRỊ t =======================
    //Lấy time từ model
    const t = this.model.fallingTime;
    const ts = t.toFixed( 2 );
    this.tText.string = `t = ${ts} s`;
  }
}

stem.register( 'StemScreenView', StemScreenView );