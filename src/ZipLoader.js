/**
 * @author Takahiro / https://github.com/takahirox
 */
import * as THREE from 'three';
import JSZip from 'jszip';

class ZipLoader {
	constructor(manager) {
		this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	}
	/** Errors that can be thrown */
	#errors = {
		JSZIPREFError: class extends ReferenceError {
			constructor(message) {
				super(message);
				this.name = "ZipLoader.JSZIPREFError";
			}
		}
	}

	#checkJSZipAvailability(onError) {
		if (typeof JSZip === 'undefined') {
			var error = new this.#errors.JSZIPREFError('Import JSZip https://stuk.github.io/jszip/');
			if (onError !== undefined) {
				onError(error);
				return false;
			} else {
				throw error;
			}
		}
		return true;
	}
	/**
	 * @param {Object} zip zip object from jszip unzip function.
	 * @returns {Object} fileMap
	 */
	async #makeblobURLs(url, zip) {
		var fileMap = {};
		var pendings = [];
		var baseUrl = 'blob:' + THREE.LoaderUtils.extractUrlBase(url);
		for (var file in zip.files) {
			var entry = zip.file(file);
			if (entry === null) continue;
			pendings.push(entry.async('blob').then(function (file, blob) {
				fileMap[baseUrl + file] = URL.createObjectURL(blob);
			}.bind(this, file)));
		}
		await Promise.all(pendings);
		console.log(fileMap)
		return fileMap;
	}
	load(url, onProgress, onError) {
		if (!this.#checkJSZipAvailability(onError)) return;
		var scope = this;
		// var promise = JSZip.external.Promise;

		return new Promise(function (resolve, reject) {
			var loader = new THREE.FileLoader(scope.manager);
			loader.setResponseType('arraybuffer');
			loader.load(url, resolve, onProgress, reject);
		})
			.then((buffer) => JSZip.loadAsync(buffer))
			.then(zip => this.#makeblobURLs(url, zip))
			.then((fileMap) => ({
				getFileList: fileMap,
				urlResolver: function (url) {
					url = url.replace('\\', '/');
					console.log(
						`THREE.ZipLoader.urlResolver: Resolving Url...\n${url}`);
					return fileMap[url] ? fileMap[url] : url;
				},
				find: function (query) {
					if (typeof query === 'string') {
						query = new RegExp(query.replace(/\./g, '\/.'));
					}
					var files = [];
					for (var key in fileMap) {
						if (key.match(query) !== null) {
							files.push(key);
						}
					}
					return files;
				}
			})).catch(onError);
	}
}
export { ZipLoader };