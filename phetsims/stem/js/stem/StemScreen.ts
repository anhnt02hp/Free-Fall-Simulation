// Copyright 2025, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author anhnt02hp
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import StemColors from '../common/StemColors.js';
import stem from '../stem.js';
import StemStrings from '../StemStrings.js';
import StemModel from './model/StemModel.js';
import StemScreenView from './view/StemScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to StemScreen here
};

type StemScreenOptions = SelfOptions & ScreenOptions;

export default class StemScreen extends Screen<StemModel, StemScreenView> {

  public constructor( providedOptions: StemScreenOptions ) {

    const options = optionize<StemScreenOptions, SelfOptions, ScreenOptions>()( {
      name: StemStrings.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: StemColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new StemModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new StemScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

stem.register( 'StemScreen', StemScreen );