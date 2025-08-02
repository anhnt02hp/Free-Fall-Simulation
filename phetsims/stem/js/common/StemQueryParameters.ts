// Copyright 2025, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author anhnt02hp
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import stem from '../stem.js';

const StemQueryParameters = QueryStringMachine.getAll( {
  //TODO add schemas for query parameters
} );

stem.register( 'StemQueryParameters', StemQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.stem.StemQueryParameters' );

export default StemQueryParameters;