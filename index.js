/**
 * @author Takahiro / https://github.com/takahirox
 */
import { ZipLoader } from './src/ZipLoader.js';
import { ZipLoadingManager } from './src/ZipLoadingManager.js';
export { ZipLoader, ZipLoadingManager }

// auto extended when three is definded.
// check THREE is defined as const or Module.
if (typeof THREE !== 'undefined') {
	// throw new Error('THREE.ZipLoader: Import Three.js https://github.com/mrdoob/three.js/ ' +
	// 	'before loading ZipLoader.');
	THREE.ZipLoader = ZipLoader;
	THREE.ZipLoadingManager = ZipLoadingManager;
}