import Property from '../../../../axon/js/Property.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Text from '../../../../scenery/js/nodes/Text.js';

export enum FreefallMode {
  ONE_OBJECT,
  TWO_OBJECTS
}

export default class FreefallModeRadioButtonGroup extends RectangularRadioButtonGroup<FreefallMode> {
  public constructor( modeProperty: Property<FreefallMode> ) {

    super( modeProperty, [
      {
        value: FreefallMode.ONE_OBJECT,
        createNode: () => new Text( '1 vật', { fontSize: 14 } )
      },
      {
        value: FreefallMode.TWO_OBJECTS,
        createNode: () => new Text( '2 vật', { fontSize: 14 } )
      }
    ], {
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: 'lightgray'
      }
    } );
  }
}
