Marker Clusterer – A Google Maps JavaScript API utility library
==============

A Google Maps JavaScript API v3 library to create and manage per-zoom-level clusters for large amounts of markers.

[Reference documentation](https://googlemaps.github.io/js-marker-clusterer/docs/reference.html)

Typescript version, with some additions / improvements.

## Usage

Download or clone `markerclusterer.js` and images `m1.png` to `m5.png`, save images in `images` folder.

To use your own custom cluster images just name your images `m[1-5].png` or set the `imagePath` option to the location and name of your images like this: `imagePath: 'customImages/cat'` for images `cat1.png` to `cat5.png`.

    ...
(require as any)(['konnect/viewmodels/components/konnect/map/js-marker-clusterer/marker-clusterer'], requires => {
      this.MarkerClusterer = requires.MarkerClusterer;

      [...]

      clustererOptions["maxZoomReachedCb"] = (marker) => {
        //Called when max zoom reached and there's still a cluster at the position
        //Do some code
    };

    //Create the MarkerClustere
    new this.MarkerClusterer(this.map, markers, clustererOptions);
});
    ...
    

## Live Demos

[![Marker Clusterer Screenshot](https://googlemaps.github.io/js-marker-clusterer/screenshot.png)](https://googlemaps.github.io/js-marker-clusterer/docs/examples.html)

## License

Copyright 2014 Google Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
