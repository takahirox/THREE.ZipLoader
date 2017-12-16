# THREE.ZipLoader
Zip archived model file Loading helper for Three.js (>= r89dev)

## Demo

[Demo with glTF 2.0 model](https://rawgit.com/takahirox/THREE.ZipLoader/v0.0.1/index.html)

## Browser

### How to use

Use THREE.ZipLoader

```html
<script src="https://rawgit.com/mrdoob/three.js/dev/build/three.js"></script>
<script src="https://rawgit.com/mrdoob/three.js/dev/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.rawgit.com/takahirox/THREE.ZipLoader/v0.0.1/build/ziploader.min.js"></script>
<script>
	var url = 'models/BoomBox.zip';
	//var url = 'models/gltf/BoomBox.gltf';

	var manager = new THREE.LoadingManager();

	new Promise( function( resolve, reject ) {

		if ( url.match( /\.zip$/ ) ) {

			new THREE.ZipLoader().load( url ).then( function( zip ) {

				manager.setURLModifier( zip.urlResolver );

				resolve( zip.find( /\.(gltf|glb)$/i )[ 0 ] );

			} );

		} else {

			resolve( url );

		}

	} ).then( function ( file ) {

		new THREE.GLTFLoader( manager ).load( file, function ( gltf ) {

			scene.add( gltf.scene );

		} );

	} );
</script>
```

or use THREE.ZipLoadingManager

```html
<script src="https://rawgit.com/mrdoob/three.js/dev/build/three.js"></script>
<script src="https://rawgit.com/mrdoob/three.js/dev/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.rawgit.com/takahirox/THREE.ZipLoader/v0.0.1/build/ziploader.min.js"></script>
<script>
	var url = 'models/BoomBox.zip';
	//var url = 'models/gltf/BoomBox.gltf';

	THREE.ZipLoadingManager
			.uncompress( url, [ '.gltf', '.glb' ] )
			.then( function ( zip ) {

		new THREE.GLTFLoader( zip.manager ).load( zip.urls[ 0 ], function ( gltf ) {

			scene.add( gltf.scene );

		} );

	} );
</script>
```

Note: API hasn't been fixed yet!

## NPM

### How to install

```
$ npm install three-ziploader
```

### How to build

```
$ git clone https://github.com/takahirox/THREE.ZipLoader.git
$ cd THREE.ZipLoader
$ npm install
$ npm run all
```

## Links
- Dependencies
  - Three.js: https://github.com/mrdoob/three.js/
  - JSZip: https://stuk.github.io/jszip/
- Polyfill
  - Promises: https://github.com/stefanpenner/es6-promise
