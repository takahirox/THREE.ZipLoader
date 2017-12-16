/**
 * @author Takahiro / https://github.com/takahirox
 */

if ( typeof THREE === 'undefined' ) {

	throw new Error( 'THREE.ZipLoader: Import Three.js https://github.com/mrdoob/three.js/ ' +
	                 'before loading ZipLoader.' );

}

import { ZipLoader } from './src/ZipLoader.js';
import { ZipLoadingManager } from './src/ZipLoadingManager.js';

THREE.ZipLoader = ZipLoader;
THREE.ZipLoadingManager = ZipLoadingManager;
