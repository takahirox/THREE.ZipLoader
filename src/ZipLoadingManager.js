import * as THREE from 'three';
import { ZipLoader } from './ZipLoader.js';
/**
 * zip file loader for threejs.
 * @author Takahiro / https://github.com/takahirox
 * @extends THREE.LoadingManager
 */
class ZipLoadingManager extends THREE.LoadingManager {
	constructor(onLoad, onProgress, onError) {
		super(onLoad, onProgress, onError)
	}
	/** Errors that can be thrown */
	#errors = {
		ENOENT: class extends Error {
			constructor(exts, url) {
				super(`No ${exts.join(', ')} file in ${url}`);
				this.name = "ZipLoadingManager.ENOENT";
			}
		}
	}
	/**
	 * @author jomin398
	 * @see {@link https://github.com/takahirox} original author
	 * @see {@link ZipLoader} This function is wrap of Ziploder
	 * @param {String} url zip file url.
	 * @param {String} exts model file extension.
	 * @returns {{urls: Array<String>, manager: ZipLoadingManager}}
	 */
	uncompress(url, exts, onLoad, onProgress, onError) {
		const self = this;
		if (url.match(/\.zip$/) === null) return Promise.resolve({
			urls: [url],
			manager: this
		});
		//arrayfy when given exts is String.
		if (!Array.isArray(exts)) exts = [exts];
		//Regexp for File Search using given extension;
		const searchRegex = new RegExp(`(${exts.join('|').replace(/\./gm, '\\.')})`, 'i');
		return new ZipLoader(this).load(url).then(function (zip) {
			let files = zip.find(searchRegex);
			if (files.length === 0) {
				return Promise.reject(new self.#errors.ENOENT(exts, url));
			}
			self.setURLModifier(zip.urlResolver);
			return {
				urls: files,
				manager: self
			};
		}).catch(onError);
	};
}
export { ZipLoadingManager };