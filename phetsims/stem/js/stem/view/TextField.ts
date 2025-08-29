import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Font from '../../../../scenery/js/util/Font.js';
import FocusandBlur from './FocusandBlur.js';

//-------Tạo function TextField------//
export default class TextField extends Node {
  private background: Rectangle;
  private textNode: Text;
  private value: string;
  private hasFocused: boolean = false;
  private FocusManager: FocusandBlur;
  

  constructor( options: { width?: number, height?: number, fontSize?: number } = {} ) {
    super();

    const width = options.width || 120;
    const height = options.height || 30;
    const fontSize = options.fontSize || 16;

    this.value = '';

    this.background = new Rectangle( 0, 0, width, height, {
      fill: 'white',
      stroke: 'black',
      cornerRadius: 4
    } );

    this.textNode = new Text( this.value, {
      font: new Font( { size: fontSize } ),
      centerY: this.background.centerY,
      left: this.background.left + 5,
      fill: 'black'
    } );

    this.addChild( this.background );
    this.addChild( this.textNode );
   
    this.FocusManager = new FocusandBlur( this, this.background );

    //--------Chỉ khi nào chuột click vào box thì mới cho focus-------//
    window.addEventListener( 'keydown', e => {
        if ( !this.FocusManager.isFocused ) return;

        if ( e.key === 'Backspace') {
            this.value = this.value.slice(0, -1);
        }
        else if ( e.key.length === 1) {
        this.value += e.key;
        }
        this.textNode.string = this.value;
} );

}

  private convertMass(value: string, to: 'kg' | 'g'): string {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    if (to === 'kg') {
      return (num / 1000).toString();
    }
    else {
      return (num*1000).toString();
    }
  }

  public getValue(unit?: 'kg' | 'g'): string {
    if (!unit) {
      return this.value;
    }
    return this.convertMass(this.value, unit);
  }

  public setValue( v: string, unit: 'kg' | 'g' = 'kg' ): void {
    const num = parseFloat(v);
    if (isNaN(num)) {
      this.value = v;
    }
    else {
      this.value = (unit === 'g' ? num / 1000: num).toString();
    }
    this.textNode.string = this.value;
  }

}