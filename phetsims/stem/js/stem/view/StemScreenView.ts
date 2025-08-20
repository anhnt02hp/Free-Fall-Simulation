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
import EnvironmentBox from '../view/EnvironmentBox.js';
import Environment from '../model/EnvironmentChange.js';

type SelfOptions = {
 //TODO add options that are specific to StemScreenView here
};

type StemScreenViewOptions = SelfOptions & ScreenViewOptions;

const radius = 15;

const environment = new Environment();

export default class StemScreenView extends ScreenView {
  private readonly model: StemModel;
  private readonly draggableCircleInitialPosition = { x: 0, y: 0 };
  private readonly dragCircle: Circle;

  //SKY & GROUND
  private sky: Rectangle;
  private ground: Rectangle;

  private readonly draggableSquareInitialPosition = { x: 0, y: 0 };
  private readonly dragSquare: Rectangle;
  //================= Object A =================
  private sText_A!: Text;
  private hText_A!: Text;
  private vText_A!: Text;
  private vmaxText_A!: Text;
  private tText_A!: Text;

  //================= Object B =================
  private sText_B!: Text;
  private hText_B!: Text;
  private vText_B!: Text;
  private vmaxText_B!: Text;
  private tText_B!: Text;


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
    this.sky = new Rectangle( 0, 0, screenWidth, skyHeight, {
      fill: '#dbf3fa',
      left: screenLeft,
      top: screenTop
    } );
    this.addChild( this.sky );

    // Mặt đất (5% chiều cao màn hình)
    this.ground = new Rectangle( 0, 0, screenWidth, groundHeight, {
      fill: '#77dd77',
      left: screenLeft,
      top: screenTop + skyHeight
    } );
    this.addChild( this.ground );
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


    //=====================AIR RESISTANCE============================
    const airButtonLabelProperty = new Property(
      `Air Resistance: ${this.model.objectA.airResistanceEnabled ? 'ON' : 'OFF'}`
    );

    const airToggleButton = new TextPushButton( airButtonLabelProperty, {
      font: new PhetFont( 14 ),
      baseColor: '#f4c542',
      listener: () => {
        const newState = !this.model.objectA.airResistanceEnabled;
        this.model.setAirResistance(newState);
        airButtonLabelProperty.value = `Air Resistance: ${newState ? 'ON' : 'OFF'}`;
      }
    });

    // Đặt nút ngay bên trên Box A
    airToggleButton.left = screenRight - 220 - 10;
    airToggleButton.top  = screenTop + 10;
    this.addChild( airToggleButton );
    //==================================================================

    //==========INFORMATION BOX A=====================================
    const rectWidth = 220;
    const rectHeight = 200;
    const cornerRadius = 10;

    // Vị trí box A (trên)
    const rectA_X = screenRight - rectWidth - 10;
    const rectA_Y = screenTop + 10;

    const infoBoxA = new Rectangle(
      rectA_X, rectA_Y,       // vị trí góc trên bên trái
      rectWidth, rectHeight,  // kích thước
      {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        cornerRadius: cornerRadius
      }
    );

    infoBoxA.left = rectA_X;
    infoBoxA.top = rectA_Y;
    this.addChild(infoBoxA);

    //============TITLEBOX A============================
    const titleText_A = new Text('FREE-FALL: OBJECT A', {
      font: new PhetFont({ size: 16, weight: 'bold' }),
      fill: 'black'
    });
    titleText_A.left = infoBoxA.left + 10;
    titleText_A.top = infoBoxA.top + 10;
    this.addChild(titleText_A);

    //============TEXTS A===============================
    this.sText_A = new Text('s = 0.0 m', { font: new PhetFont( 18 ), fill: 'black' });
    this.hText_A = new Text('h = 0.0 m', { font: new PhetFont( 18 ), fill: 'black' });
    this.vText_A = new Text('v = 0.0 m/s', { font: new PhetFont( 18 ), fill: 'black' });
    this.vmaxText_A = new Text('vmax = 0.0 m/s', { font: new PhetFont( 18 ), fill: 'black' });
    this.tText_A = new Text('t = 0.0 s', { font: new PhetFont( 18 ), fill: 'black' });

    // Vị trí từng text A
    this.sText_A.left = titleText_A.left;
    this.sText_A.top = titleText_A.bottom + 10;

    this.hText_A.left = titleText_A.left;
    this.hText_A.top = this.sText_A.bottom + 5;

    this.vText_A.left = titleText_A.left;
    this.vText_A.top = this.hText_A.bottom + 5;

    this.vmaxText_A.left = titleText_A.left;
    this.vmaxText_A.top = this.vText_A.bottom + 5;

    this.tText_A.left = titleText_A.left;
    this.tText_A.top = this.vmaxText_A.bottom + 5;

    // Add texts A
    this.addChild(this.sText_A);
    this.addChild(this.hText_A);
    this.addChild(this.vText_A);
    this.addChild(this.vmaxText_A);
    this.addChild(this.tText_A);

    //============ ENVIRONMENT BOX ============================
    const envBox = new EnvironmentBox(infoBoxA, environment, (envName) => {
      switch (envName) {
        case 'Earth':
          this.sky.fill = '#dbf3fa';
          this.ground.fill = '#77dd77';
          break;
        case 'Mars':
          this.sky.fill = '#ffe2e1';
          this.ground.fill = '#ff9933';
          break;
        case 'Moon':
          this.sky.fill = '#a9a9a9';
          this.ground.fill = '#4f4f4f';
          break;
      }
    });
    this.addChild(envBox);

    //==========INFORMATION BOX B=====================================
    // Vị trí box B (dưới box A)
    const rectB_X = rectA_X;
    const rectB_Y = infoBoxA.bottom + 90;

    const infoBoxB = new Rectangle(
      rectB_X, rectB_Y,       // vị trí góc trên bên trái
      rectWidth, rectHeight,  // kích thước
      {
        fill: 'white',
        stroke: 'black',
        lineWidth: 1,
        cornerRadius: cornerRadius
      }
    );

    infoBoxB.left = rectB_X;
    infoBoxB.top = rectB_Y;
    this.addChild(infoBoxB);

    //============TITLEBOX B============================
    const titleText_B = new Text('FREE-FALL: OBJECT B', {
      font: new PhetFont({ size: 16, weight: 'bold' }),
      fill: 'black'
    });
    titleText_B.left = infoBoxB.left + 10;
    titleText_B.top = infoBoxB.top + 10;
    this.addChild(titleText_B);

    //============TEXTS B===============================
    this.sText_B = new Text('s = 0.0 m', { font: new PhetFont( 18 ), fill: 'blue' });
    this.hText_B = new Text('h = 0.0 m', { font: new PhetFont( 18 ), fill: 'blue' });
    this.vText_B = new Text('v = 0.0 m/s', { font: new PhetFont( 18 ), fill: 'blue' });
    this.vmaxText_B = new Text('vmax = 0.0 m/s', { font: new PhetFont( 18 ), fill: 'blue' });
    this.tText_B = new Text('t = 0.0 s', { font: new PhetFont( 18 ), fill: 'blue' });

    // Vị trí từng text B
    this.sText_B.left = titleText_B.left;
    this.sText_B.top = titleText_B.bottom + 10;

    this.hText_B.left = titleText_B.left;
    this.hText_B.top = this.sText_B.bottom + 5;

    this.vText_B.left = titleText_B.left;
    this.vText_B.top = this.hText_B.bottom + 5;

    this.vmaxText_B.left = titleText_B.left;
    this.vmaxText_B.top = this.vText_B.bottom + 5;

    this.tText_B.left = titleText_B.left;
    this.tText_B.top = this.vmaxText_B.bottom + 5;

    // Add texts B
    this.addChild(this.sText_B);
    this.addChild(this.hText_B);
    this.addChild(this.vText_B);
    this.addChild(this.vmaxText_B);
    this.addChild(this.tText_B);

    // Link visibility của info box B
    this.model.objectBVisibleProperty.link( visible => {
      infoBoxB.visible = visible;
      titleText_B.visible = visible;
      this.sText_B.visible = visible;
      this.hText_B.visible = visible;
      this.vText_B.visible = visible;
      this.vmaxText_B.visible = visible;
      this.tText_B.visible = visible;
    });

    //========================================================================

    // ================== CREATE CIRCLE (objectA) ===================
    let wasDraggedCircle = false;

    this.draggableCircleInitialPosition = new Vector2(initialX, initialY);

    this.model.objectA.setInitialPosition(initialY - radius);
    this.model.setGroundY(initialY - radius);

    const dragCircle = new Circle(radius, {
      fill: 'red',
      centerX: initialX,
      centerY: initialY - radius,
      cursor: 'pointer'
    });

    const dragBounds = Bounds2.rect(
      screenLeft,
      screenTop,
      screenRight,
      initialY
    );

    const dragListenerCircle = new DragListener({
      translateNode: true,
      start: () => {
        wasDraggedCircle = false;
        // Reset "mềm" giữ vị trí hiện tại để tránh nhảy lên cao
        this.model.objectA.softResetAt(dragCircle.centerY);
      },
      drag: () => {
        wasDraggedCircle = true;
        if (!this.model.objectA.isFalling) {
          dragCircle.centerX = Math.min(
            dragBounds.maxX - radius,
            Math.max(dragBounds.minX + radius, dragCircle.centerX)
          );
          dragCircle.centerY = Math.min(
            dragBounds.maxY - radius,
            Math.max(dragBounds.minY + radius, dragCircle.centerY)
          );
          this.model.objectA.setInitialPosition(dragCircle.centerY);
        }
      },
      end: () => {
        this.model.objectA.setInitialPosition(dragCircle.centerY);
      }
    });

    dragCircle.addInputListener(dragListenerCircle);

    dragCircle.addInputListener({
      up: () => {
        if (!wasDraggedCircle && !this.model.objectA.isFalling) {
          this.model.objectA.startFalling();
        }
      }
    });

    this.dragCircle = dragCircle;
    this.addChild(dragCircle);


    // ================== CREATE SQUARE (objectB) ===================
    let wasDraggedSquare = false;

    this.draggableSquareInitialPosition = new Vector2(initialX + radius + 50, initialY);

    this.model.objectB.setInitialPosition(initialY - radius);
    this.model.setGroundY(initialY - radius);

    const dragSquare = new Rectangle(
      0, 0, radius * 2, radius * 2,
      {
        fill: 'blue',
        cursor: 'pointer'
      }
    );

    dragSquare.centerX = initialX + radius + 50;
    dragSquare.centerY = initialY - radius;

    const dragSquareBounds = Bounds2.rect(
      screenLeft,
      screenTop,
      screenRight,
      initialY
    );

    const dragSquareListener = new DragListener({
      translateNode: true,
      start: () => {
        wasDraggedSquare = false;
        this.model.objectB.softResetAt(dragSquare.centerY);
      },
      drag: () => {
        wasDraggedSquare = true;
        if (!this.model.objectB.isFalling) {
          dragSquare.centerX = Math.min(
            dragSquareBounds.maxX - radius,
            Math.max(dragSquareBounds.minX + radius, dragSquare.centerX)
          );
          dragSquare.centerY = Math.min(
            dragSquareBounds.maxY - radius,
            Math.max(dragSquareBounds.minY + radius, dragSquare.centerY)
          );
          this.model.objectB.setInitialPosition(dragSquare.centerY);
        }
      },
      end: () => {
        this.model.objectB.setInitialPosition(dragSquare.centerY);
      }
    });

    dragSquare.addInputListener(dragSquareListener);

    dragSquare.addInputListener({
      up: () => {
        if (!wasDraggedSquare && !this.model.objectB.isFalling) {
          this.model.objectB.startFalling();
        }
      }
    });

    this.dragSquare = dragSquare;
    this.addChild(dragSquare);
    //=============================================================

    // ================= MODE RADIO BUTTON (1 vật / 2 vật) =================
    const freefallModeProperty = new Property<FreefallMode>( FreefallMode.ONE_OBJECT );

    const modeRadioGroup = new FreefallModeRadioButtonGroup( freefallModeProperty );
    modeRadioGroup.left = airToggleButton.left;
    modeRadioGroup.top = airToggleButton.bottom + 10;
    //Dịch chuyển box A xuống dưới 2 nút
    infoBoxA.top = modeRadioGroup.bottom + 10;
    titleText_A.top = infoBoxA.top + 10;
    this.sText_A.top = titleText_A.bottom + 10;
    this.hText_A.top = this.sText_A.bottom + 5;
    this.vText_A.top = this.hText_A.bottom + 5;
    this.vmaxText_A.top = this.vText_A.bottom + 5;
    this.tText_A.top = this.vmaxText_A.bottom + 5;


    this.addChild( modeRadioGroup );

    // Link với model để cập nhật chế độ
    freefallModeProperty.link( mode => {
      this.model.freefallModeProperty.value = mode;
    });

    // Link visibility của objectA và objectB với property trong model
    this.model.objectAVisibleProperty.link( visible => {
      this.dragCircle.visible = visible;
    });
    this.model.objectBVisibleProperty.link( visible => {
      this.dragSquare.visible = visible;
    });
    //=====================================================================

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
    this.model.objectA.setInitialPosition( this.dragCircle.centerY );
    this.model.objectB.setInitialPosition( this.dragCircle.centerY );
    this.model.setGroundY( this.draggableCircleInitialPosition.y - radius ); 
    this.model.reset();
    //==============================================================
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step(dt: number): void {
  this.model.step(dt);

  // Cập nhật vị trí hình tròn từ objectA
  this.dragCircle.centerY = this.model.objectA.position;
  // Cập nhật vị trí hình vuông từ objectB
  this.dragSquare.centerY = this.model.objectB.position;

  // ==================== CẬP NHẬT GIÁ TRỊ s ======================
  const referenceY_A = this.draggableCircleInitialPosition.y - radius;
  const currentY_A = this.dragCircle.centerY;
  const s_A = referenceY_A - currentY_A;
  const sMeters_A = (s_A / 100).toFixed(2);
  this.sText_A.string = `s(A) = ${sMeters_A} m`;

  const referenceY_B = this.draggableSquareInitialPosition.y - radius;
  const currentY_B = this.dragSquare.centerY;
  const s_B = referenceY_B - currentY_B;
  const sMeters_B = (s_B / 100).toFixed(2);
  this.sText_B.string = `s(B) = ${sMeters_B} m`;

  //======================CẬP NHẬT GIÁ TRỊ h=======================
  if (this.model.objectA.isFalling) {
    const h_A = this.model.objectA.groundY - this.dragCircle.centerY;
    this.model.objectA.lastHeight = h_A;
    this.hText_A.string = `h(A) = ${(h_A / 100).toFixed(2)} m`;
  } else {
    this.hText_A.string = `h(A) = ${(this.model.objectA.lastHeight / 100).toFixed(2)} m`;
  }

  if (this.model.objectB.isFalling) {
    const h_B = this.model.objectB.groundY - this.dragSquare.centerY;
    this.model.objectB.lastHeight = h_B;
    this.hText_B.string = `h(B) = ${(h_B / 100).toFixed(2)} m`;
  } else {
    this.hText_B.string = `h(B) = ${(this.model.objectB.lastHeight / 100).toFixed(2)} m`;
  }

  //======================CẬP NHẬT GIÁ TRỊ v =======================
  const vMeters_A = (this.model.objectA.velocity / 100).toFixed(2);
  this.vText_A.string = `v(A) = ${vMeters_A} m/s`;

  const vMeters_B = (this.model.objectB.velocity / 100).toFixed(2);
  this.vText_B.string = `v(B) = ${vMeters_B} m/s`;

  //======================CẬP NHẬT GIÁ TRỊ vmax =======================
  const vmaxMeters_A = (this.model.objectA.vMax / 100).toFixed(2);
  this.vmaxText_A.string = `vmax(A) = ${vmaxMeters_A} m/s`;

  const vmaxMeters_B = (this.model.objectB.vMax / 100).toFixed(2);
  this.vmaxText_B.string = `vmax(B) = ${vmaxMeters_B} m/s`;

  //======================CẬP NHẬT GIÁ TRỊ t =======================
  const ts_A = this.model.objectA.fallingTime.toFixed(2);
  this.tText_A.string = `t(A) = ${ts_A} s`;

  const ts_B = this.model.objectB.fallingTime.toFixed(2);
  this.tText_B.string = `t(B) = ${ts_B} s`;
}
}

stem.register( 'StemScreenView', StemScreenView );