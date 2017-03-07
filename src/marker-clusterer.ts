import { Cluster } from './cluster';
import { google } from "@types/google-maps";
// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/maps/google_maps_api_v3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * @license
 * Copyright 2010 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


export class MarkerClusterer {

  _map = null;
  _markers: Array<google.maps.Marker> = [];
  _clusters: Array<Cluster> = [];
  sizes = [];
  _styles = [];
  _ready: boolean = false;
  _gridSize: number = 60;
  _minClusterSize = 0;
  _maxZoom: number = 22;
  _imagePath: string = "";
  _imageExtension: string = "";
  _MARKER_CLUSTER_IMAGE_PATH: string = '../images/m';
  _MARKER_CLUSTER_IMAGE_EXTENSION: string = "png";
  _zoomOnClick: boolean = true;
  _averageCenter: boolean = false;
  _prevZoom: number = 0;
  maxZoomReachedCb : Function = (marker : any) => {};


  /**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Whether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 *       'iconAnchor': (Array) The anchor position of the icon x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
  constructor(map, opt_markers, opt_options) {
    this.extend(MarkerClusterer, google.maps.OverlayView);

    this._map = map;
    this.sizes = [53, 56, 66, 78, 90];
    let options = opt_options || {};
    this._gridSize = options['gridSize'] || 60;
    this._minClusterSize = options['minimumClusterSize'] || 2;
    this._maxZoom = options['maxZoom'] || 22;
    this._styles = options['styles'] || [];
    this._imagePath = options['imagePath'] || this._MARKER_CLUSTER_IMAGE_PATH;
    this._imageExtension = options['imageExtension'] || this._MARKER_CLUSTER_IMAGE_EXTENSION;
    this.maxZoomReachedCb = options['maxZoomReachedCb'] as Function | null;

    if (options['zoomOnClick'] != undefined) {
      this._zoomOnClick = options['zoomOnClick'];
    }

    if (options['averageCenter'] != undefined) {
      this._averageCenter = options['averageCenter'];
    }

    this.setupStyles();
    this.setMap(map);
    this._prevZoom = this._map.getZoom();

    // Add the map event listeners
    //@Changed ggrimbert -> events are not used here, the map calling this already deals with it
    /*google.maps.event.addListener(this._map, 'zoom_changed', () => {
      var zoom = this._map.getZoom();

      if (this._prevZoom != zoom) {
        this._prevZoom = zoom;
        this.resetViewport();
      }
    });

    google.maps.event.addListener(this._map, 'idle', () => {
      this.redraw();
    });*/

    // Finally, add the markers
    if (opt_markers && opt_markers.length) {
      this.addMarkers(opt_markers, false);
    }
  }

  extend(obj1, obj2) {
  return (function(object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }).apply(obj1, [obj2]);
  }

  /**
   * Implementaion of the interface method.
   * @ignore
   */
  onAdd() {
    this.setReady(true);
  };

  /**
   * Implementaion of the interface method.
   * @ignore
   */
  draw() { };

  /**
   * Sets up the styles object.
   * @private
   */
  setupStyles() {
    if (this._styles.length) {
      return;
    }

    for (var i = 0, size; size = this.sizes[i]; i++) {
      this._styles.push({
        url: this._imagePath + (i + 1) + '.' + this._imageExtension,
        height: size,
        width: size
      });
    }
  };

  /**
   *  Fit the map to the bounds of the markers in the clusterer.
   */
  fitMapToMarkers() {
    var markers = this.getMarkers();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, marker; marker = markers[i]; i++) {
      bounds.extend(marker.getPosition());
    }

    this._map.fitBounds(bounds);
  };

  /**
   *  Sets the styles.
   *  @param {Object} styles The style to set.
   */
  setStyles(styles) {
    this._styles = styles;
  };

  /**
   *  Gets the styles.
   *  @return {Object} The styles object.
   */
  getStyles() {
    return this._styles;
  };

  /**
   * Whether zoom on click is set.
   * @return {boolean} True if _zoomOnClick is set.
   */
  isZoomOnClick() {
    return this._zoomOnClick;
  };

  /**
   * Whether average center is set.
   * @return {boolean} True if _averageCenter is set.
   */
  isAverageCenter() {
    return this._averageCenter;
  };

  /**
   *  Returns the array of markers in the clusterer.
   *  @return {Array.<google.maps.Marker>} The markers.
   */
  getMarkers() {
    return this._markers;
  };

  /**
   *  Returns the number of markers in the clusterer
   *  @return {Number} The number of markers.
   */
  getTotalMarkers() {
    return this._markers.length;
  };

  /**
   *  Sets the max zoom for the clusterer.
   *  @param {number} maxZoom The max zoom level.
   */
  setMaxZoom(maxZoom) {
    this._maxZoom = maxZoom;
  };

  /**
   *  Gets the max zoom for the clusterer.
   *  @return {number} The max zoom level.
   */
  getMaxZoom() {
    return this._maxZoom;
  };

  /**
   *  The function for calculating the cluster icon image.
   *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
   *  @param {number} numStyles The number of styles available.
   *  @return {Object} A object properties: 'text' (string) and 'index' (number).
   *  @private
   */
  _calculator(markers, numStyles) {
    var index = 0;
    var count = markers.length;
    var dv = count;
    while (dv !== 0) {
      dv = Math.trunc(dv / 10);
      index++;
    }

    index = Math.min(index, numStyles);
    return {
      text: count,
      index: index
    };
  };

  /**
   * Set the calculator function.
   * @param {function(Array, number)} calculator The function to set as the
   *     calculator. The function should return a object properties:
   *     'text' (string) and 'index' (number).
   */
  setCalculator(calculator) {
    this._calculator = calculator;
  };

  /**
   * Get the calculator function.
   * @return {function(Array, number)} the calculator function.
   */
  getCalculator() {
    return this._calculator;
  };

  /**
   * Add an array of markers to the clusterer.
   * @param {Array.<google.maps.Marker>} markers The markers to add.
   * @param {boolean=} opt_nodraw Whether to redraw the clusters.
   */
  addMarkers(markers, opt_nodraw) {
    for (var i = 0, marker; marker = markers[i]; i++) {
      this._pushMarkerTo(marker);
    }
    if (!opt_nodraw) {
      this.redraw();
    }
  };

  /**
   * Pushes a marker to the clusterer.
   * @param {google.maps.Marker} marker The marker to add.
   * @private
   */
  _pushMarkerTo(marker) {
    marker.isAdded = false;
    if (marker['draggable']) {
      // If the marker is draggable add a listener so we update the clusters on
      // the drag end.
      google.maps.event.addListener(marker, 'dragend', () => {
        marker.isAdded = false;
        this.repaint();
      });
    }
    this._markers.push(marker);
  };

  /**
   * Adds a marker to the clusterer and redraws if needed.
   * @param {google.maps.Marker} marker The marker to add.
   * @param {boolean=} opt_nodraw Whether to redraw the clusters.
   */
  addMarker(marker, opt_nodraw) {
    this._pushMarkerTo(marker);
    if (!opt_nodraw) {
      this.redraw();
    }
  };

  /**
   * Removes a marker and returns true if removed, false if not
   * @param {google.maps.Marker} marker The marker to remove
   * @return {boolean} Whether the marker was removed or not
   * @private
   */
  _removeMarker(marker, idx : number = -1) {
    var index = idx;

    //When coming from removeMarkers, we already have the index
    if (index < -1) {
      if (this._markers.indexOf) {
      index = this._markers.indexOf(marker);
      } else {
        for (var i = 0, m; m = this._markers[i]; i++) {
          if (m == marker) {
            index = i;
            break;
          }
        }
      }
    }
    
    if (index == -1) {
      // Marker is not in our list of markers.
      return false;
    }

    marker.setMap(null);
    //ggrimbert, Bug when called from removeMarkers, the splice is called while a for loop is iterating over the array
    //so only half of the complete markers array is processed
    if (idx === -1) {
      this._markers.splice(index, 1);
    }
    return true;
  };

  /**
   * Remove a marker from the cluster.
   * @param {google.maps.Marker} marker The marker to remove.
   * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
   * @return {boolean} True if the marker was removed.
   */
  removeMarker(marker, opt_nodraw) {
    var removed = this._removeMarker(marker);

    if (!opt_nodraw && removed) {
      this.resetViewport();
      this.redraw();
      return true;
    } else {
      return false;
    }
  };

  /**
   * Removes an array of markers from the cluster.
   * @param {Array.<google.maps.Marker>} markers The markers to remove.
   * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
   */
  removeMarkers(markers, opt_nodraw) {
    var removed = false;

    for (var i = 0, marker; marker = markers[i]; i++) {
      var r = this._removeMarker(marker, i);
      removed = removed || r;
    }

    this._markers = [];

    if (!opt_nodraw && removed) {
      this.resetViewport();
      this.redraw();
      return true;
    }
  };

  /**
   * Sets the clusterer's ready state.
   * @param {boolean} ready The state.
   * @private
   */
  setReady(ready) {
    if (!this._ready) {
      this._ready = ready;
      this.createClusters();
    }
  };

  /**
   * Returns the number of clusters in the clusterer.
   * @return {number} The number of clusters.
   */
  getTotalClusters() {
    return this._clusters.length;
  };

  /**
   * Returns the google map that the clusterer is associated with.
   * @return {google.maps.Map} The map.
   */
  getMap() {
    return this._map;
  };

  /**
   * Sets the google map that the clusterer is associated with.
   * @param {google.maps.Map} map The map.
   */
  setMap(map) {
    this._map = map;
  };

  /**
   * Returns the size of the grid.
   * @return {number} The grid size.
   */
  getGridSize() {
    return this._gridSize;
  };

  /**
   * Sets the size of the grid.
   * @param {number} size The grid size.
   */
  setGridSize(size) {
    this._gridSize = size;
  };

  /**
   * Returns the min cluster size.
   * @return {number} The grid size.
   */
  getMinClusterSize() {
    return this._minClusterSize;
  };

  /**
   * Sets the min cluster size.
   * @param {number} size The grid size.
   */
  setMinClusterSize(size) {
    this._minClusterSize = size;
  };

  /**
   * Extends a bounds object by the grid size.
   * @param {google.maps.LatLngBounds} bounds The bounds to extend.
   * @return {google.maps.LatLngBounds} The extended bounds.
   */
  getExtendedBounds(bounds) {
    var projection = (this as any).getProjection();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(),
      bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(),
      bounds.getSouthWest().lng());

    // Convert the points to pixels and the extend out by the grid size.
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this._gridSize;
    trPix.y -= this._gridSize;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this._gridSize;
    blPix.y += this._gridSize;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
  };

  /**
   * Determins if a marker is contained in a bounds.
   * @param {google.maps.Marker} marker The marker to check.
   * @param {google.maps.LatLngBounds} bounds The bounds to check against.
   * @return {boolean} True if the marker is in the bounds.
   * @private
   */
  _isMarkerInBounds(marker, bounds) {
    return bounds.contains(marker.getPosition());
  };

  /**
   * Clears all clusters and markers from the clusterer.
   */
  clearMarkers() {
    this.resetViewport(true);

    // Set the markers a empty array.
    this._markers = [];
  };

  /**
   * Clears all existing clusters and recreates them.
   * @param {boolean} opt_hide To also hide the marker.
   */
  resetViewport(opt_hide: boolean = false) {
    // Remove all the clusters
    for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
      cluster.remove();
    }

    // Reset the markers to not be added and to be invisible.
    for (var i = 0, marker; marker = this._markers[i]; i++) {
      marker.isAdded = false;
      if (opt_hide) {
        marker.setMap(null);
      }
    }

    this._clusters = [];
  };

  repaint() {
    var oldClusters = this._clusters.slice();
    this._clusters.length = 0;
    this.resetViewport();
    this.redraw();

    // Remove the old clusters.
    // Do it in a timeout so the other clusters have been drawn first.
    window.setTimeout(function () {
      for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
        cluster.remove();
      }
    }, 0);
  };

  /**
   * Redraws the clusters.
   */
  redraw() {
    this.createClusters();
  };

  /**
   * Calculates the distance between two latlng locations in km.
   * @see http://www.movable-type.co.uk/scripts/latlong.html
   * @param {google.maps.LatLng} p1 The first lat lng point.
   * @param {google.maps.LatLng} p2 The second lat lng point.
   * @return {number} The distance between the two points in km.
   * @private
  */
  _distanceBetweenPoints(p1, p2) {
    if (!p1 || !p2) {
      return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  /**
   * Add a marker to a cluster, or creates a new cluster.
   * @param {google.maps.Marker} marker The marker to add.
   * @private
   */
  _addToClosestCluster(marker) {
    var distance = 40000; // Some large number
    var clusterToAddTo = null;
    var pos = marker.getPosition();
    for (var i = 0, cluster; cluster = this._clusters[i]; i++) {
      var center = cluster.getCenter();
      if (center) {
        var d = this._distanceBetweenPoints(center, marker.getPosition());
        if (d < distance) {
          distance = d;
          clusterToAddTo = cluster;
        }
      }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
      clusterToAddTo.addMarker(marker);
    } else {
      var cluster : any = new Cluster(this);
      cluster.addMarker(marker);
      this._clusters.push(cluster);
    }
  };

  /**
   * Creates the clusters.
   * @private
   */
  createClusters() {
    if (!this._ready) {
      return;
    }

    // Get our current map view bounds.
    // Create a new bounds object so we don't affect the map.
    var mapBounds = new google.maps.LatLngBounds(this._map.getBounds().getSouthWest(),
      this._map.getBounds().getNorthEast());
    var bounds = this.getExtendedBounds(mapBounds);

    for (var i = 0, marker; marker = this._markers[i]; i++) {
      if (!marker.isAdded && this._isMarkerInBounds(marker, bounds)) {
        this._addToClosestCluster(marker);
      }
    }

    for (let i = 0; i < this._clusters.length; i++) {
      this._clusters[i].updateIcon();
    }
  };
}