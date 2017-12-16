/**
 * @author Takahiro / https://github.com/takahirox
 */

import JSZip from 'jszip';


function ZipLoader( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

}

function checkJSZipAvailability( onError ) {

	if ( typeof JSZip === 'undefined' ) {

		var error = new Error( 'THREE.ZipLoader: Import JSZip https://stuk.github.io/jszip/' );

		if ( onError !== undefined ) {

			onError( error );
			return false;

		} else {

			throw error;

		}

	}

	return true;

}

Object.assign( ZipLoader.prototype, {

	constructor: ZipLoader,

	load: function ( url, onProgress, onError ) {

		if ( ! checkJSZipAvailability( onError ) ) return;

		var scope = this;

		var promise = JSZip.external.Promise;

		var baseUrl = 'blob:' + THREE.LoaderUtils.extractUrlBase( url );

		return new promise( function ( resolve, reject ) {

			var loader = new THREE.FileLoader( scope.manager );
			loader.setResponseType( 'arraybuffer' );
			loader.load( url, resolve, onProgress, reject );

		} ).then( function ( buffer ) {

			return JSZip.loadAsync( buffer );

		} ).then( function ( zip ) {

			var fileMap = {};

			var pendings = [];

			for ( var file in zip.files ) {

				var entry = zip.file( file );

				if ( entry === null ) continue;

				pendings.push( entry.async( 'blob' ).then( function ( file, blob ) {

					fileMap[ baseUrl + file ] = URL.createObjectURL( blob );

				}.bind( this, file ) ) );

			}

			return promise.all( pendings ).then( function () {

				return fileMap;

			} );

		} ).then( function ( fileMap ) {

			return {

				urlResolver: function ( url ) {

					return fileMap[ url ] ? fileMap[ url ] : url;

				},

				find: function ( query ) {

					if ( typeof query === 'string' ) {

						query = new RegExp( query.replace( /\./g, '\\.' ) );

					}

					var files = [];

					for ( var key in fileMap ) {

						if ( key.match( query ) !== null ) {

							files.push( key );

						}

					}

					return files;

				}

			};

		} ).catch( onError );

	}

} );


export { ZipLoader };
