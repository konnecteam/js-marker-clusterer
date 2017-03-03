"use strict";
const cluster_1 = require("./cluster");
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
class MarkerClusterer {
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
        this.map_ = null;
        this.markers_ = [];
        this.clusters_ = [];
        this.sizes = [];
        this.styles_ = [];
        this.ready_ = false;
        this.gridSize_ = 60;
        this.minClusterSize_ = 0;
        this.maxZoom_ = 0;
        this.imagePath_ = "";
        this.imageExtension_ = "";
        this.MARKER_CLUSTER_IMAGE_PATH_ = '../images/m';
        this.MARKER_CLUSTER_IMAGE_EXTENSION_ = "png";
        this.zoomOnClick_ = true;
        this.averageCenter_ = false;
        this.prevZoom_ = 0;
        this.extend(MarkerClusterer, google.maps.OverlayView);
        this.map_ = map;
        this.sizes = [53, 56, 66, 78, 90];
        let options = opt_options || {};
        this.gridSize_ = options['gridSize'] || 60;
        this.minClusterSize_ = options['minimumClusterSize'] || 2;
        this.maxZoom_ = options['maxZoom'] || null;
        this.styles_ = options['styles'] || [];
        this.imagePath_ = options['imagePath'] || this.MARKER_CLUSTER_IMAGE_PATH_;
        this.imageExtension_ = options['imageExtension'] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;
        if (options['zoomOnClick'] != undefined) {
            this.zoomOnClick_ = options['zoomOnClick'];
        }
        if (options['averageCenter'] != undefined) {
            this.averageCenter_ = options['averageCenter'];
        }
        this.setupStyles_();
        this.setMap(map);
        this.prevZoom_ = this.map_.getZoom();
        // Add the map event listeners
        //@Changed ggrimbert -> on n'utilise pas les listeners, c'est le composant qui va appeler le constructeur, qui va refresh
        /*google.maps.event.addListener(this.map_, 'zoom_changed', () => {
          var zoom = this.map_.getZoom();
    
          if (this.prevZoom_ != zoom) {
            this.prevZoom_ = zoom;
            this.resetViewport();
          }
        });
    
        google.maps.event.addListener(this.map_, 'idle', () => {
          this.redraw();
        });*/
        // Finally, add the markers
        if (opt_markers && opt_markers.length) {
            this.addMarkers(opt_markers, false);
        }
    }
    extend(obj1, obj2) {
        return (function (object) {
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
        this.setReady_(true);
    }
    ;
    /**
     * Implementaion of the interface method.
     * @ignore
     */
    draw() { }
    ;
    /**
     * Sets up the styles object.
     * @private
     */
    setupStyles_() {
        if (this.styles_.length) {
            return;
        }
        for (var i = 0, size; size = this.sizes[i]; i++) {
            this.styles_.push({
                url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
                height: size,
                width: size
            });
        }
    }
    ;
    /**
     *  Fit the map to the bounds of the markers in the clusterer.
     */
    fitMapToMarkers() {
        var markers = this.getMarkers();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, marker; marker = markers[i]; i++) {
            bounds.extend(marker.getPosition());
        }
        this.map_.fitBounds(bounds);
    }
    ;
    /**
     *  Sets the styles.
     *  @param {Object} styles The style to set.
     */
    setStyles(styles) {
        this.styles_ = styles;
    }
    ;
    /**
     *  Gets the styles.
     *  @return {Object} The styles object.
     */
    getStyles() {
        return this.styles_;
    }
    ;
    /**
     * Whether zoom on click is set.
     * @return {boolean} True if zoomOnClick_ is set.
     */
    isZoomOnClick() {
        return this.zoomOnClick_;
    }
    ;
    /**
     * Whether average center is set.
     * @return {boolean} True if averageCenter_ is set.
     */
    isAverageCenter() {
        return this.averageCenter_;
    }
    ;
    /**
     *  Returns the array of markers in the clusterer.
     *  @return {Array.<google.maps.Marker>} The markers.
     */
    getMarkers() {
        return this.markers_;
    }
    ;
    /**
     *  Returns the number of markers in the clusterer
     *  @return {Number} The number of markers.
     */
    getTotalMarkers() {
        return this.markers_.length;
    }
    ;
    /**
     *  Sets the max zoom for the clusterer.
     *  @param {number} maxZoom The max zoom level.
     */
    setMaxZoom(maxZoom) {
        this.maxZoom_ = maxZoom;
    }
    ;
    /**
     *  Gets the max zoom for the clusterer.
     *  @return {number} The max zoom level.
     */
    getMaxZoom() {
        return this.maxZoom_;
    }
    ;
    /**
     *  The function for calculating the cluster icon image.
     *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
     *  @param {number} numStyles The number of styles available.
     *  @return {Object} A object properties: 'text' (string) and 'index' (number).
     *  @private
     */
    calculator_(markers, numStyles) {
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
    }
    ;
    /**
     * Set the calculator function.
     * @param {function(Array, number)} calculator The function to set as the
     *     calculator. The function should return a object properties:
     *     'text' (string) and 'index' (number).
     */
    setCalculator(calculator) {
        this.calculator_ = calculator;
    }
    ;
    /**
     * Get the calculator function.
     * @return {function(Array, number)} the calculator function.
     */
    getCalculator() {
        return this.calculator_;
    }
    ;
    /**
     * Add an array of markers to the clusterer.
     * @param {Array.<google.maps.Marker>} markers The markers to add.
     * @param {boolean=} opt_nodraw Whether to redraw the clusters.
     */
    addMarkers(markers, opt_nodraw) {
        for (var i = 0, marker; marker = markers[i]; i++) {
            this.pushMarkerTo_(marker);
        }
        if (!opt_nodraw) {
            this.redraw();
        }
    }
    ;
    /**
     * Pushes a marker to the clusterer.
     * @param {google.maps.Marker} marker The marker to add.
     * @private
     */
    pushMarkerTo_(marker) {
        marker.isAdded = false;
        if (marker['draggable']) {
            // If the marker is draggable add a listener so we update the clusters on
            // the drag end.
            google.maps.event.addListener(marker, 'dragend', () => {
                marker.isAdded = false;
                this.repaint();
            });
        }
        this.markers_.push(marker);
    }
    ;
    /**
     * Adds a marker to the clusterer and redraws if needed.
     * @param {google.maps.Marker} marker The marker to add.
     * @param {boolean=} opt_nodraw Whether to redraw the clusters.
     */
    addMarker(marker, opt_nodraw) {
        this.pushMarkerTo_(marker);
        if (!opt_nodraw) {
            this.redraw();
        }
    }
    ;
    /**
     * Removes a marker and returns true if removed, false if not
     * @param {google.maps.Marker} marker The marker to remove
     * @return {boolean} Whether the marker was removed or not
     * @private
     */
    removeMarker_(marker) {
        var index = -1;
        if (this.markers_.indexOf) {
            index = this.markers_.indexOf(marker);
        }
        else {
            for (var i = 0, m; m = this.markers_[i]; i++) {
                if (m == marker) {
                    index = i;
                    break;
                }
            }
        }
        if (index == -1) {
            // Marker is not in our list of markers.
            return false;
        }
        marker.setMap(null);
        this.markers_.splice(index, 1);
        return true;
    }
    ;
    /**
     * Remove a marker from the cluster.
     * @param {google.maps.Marker} marker The marker to remove.
     * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
     * @return {boolean} True if the marker was removed.
     */
    removeMarker(marker, opt_nodraw) {
        var removed = this.removeMarker_(marker);
        if (!opt_nodraw && removed) {
            this.resetViewport();
            this.redraw();
            return true;
        }
        else {
            return false;
        }
    }
    ;
    /**
     * Removes an array of markers from the cluster.
     * @param {Array.<google.maps.Marker>} markers The markers to remove.
     * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
     */
    removeMarkers(markers, opt_nodraw) {
        var removed = false;
        for (var i = 0, marker; marker = markers[i]; i++) {
            var r = this.removeMarker_(marker);
            removed = removed || r;
        }
        if (!opt_nodraw && removed) {
            this.resetViewport();
            this.redraw();
            return true;
        }
    }
    ;
    /**
     * Sets the clusterer's ready state.
     * @param {boolean} ready The state.
     * @private
     */
    setReady_(ready) {
        if (!this.ready_) {
            this.ready_ = ready;
            this.createClusters_();
        }
    }
    ;
    /**
     * Returns the number of clusters in the clusterer.
     * @return {number} The number of clusters.
     */
    getTotalClusters() {
        return this.clusters_.length;
    }
    ;
    /**
     * Returns the google map that the clusterer is associated with.
     * @return {google.maps.Map} The map.
     */
    getMap() {
        return this.map_;
    }
    ;
    /**
     * Sets the google map that the clusterer is associated with.
     * @param {google.maps.Map} map The map.
     */
    setMap(map) {
        this.map_ = map;
    }
    ;
    /**
     * Returns the size of the grid.
     * @return {number} The grid size.
     */
    getGridSize() {
        return this.gridSize_;
    }
    ;
    /**
     * Sets the size of the grid.
     * @param {number} size The grid size.
     */
    setGridSize(size) {
        this.gridSize_ = size;
    }
    ;
    /**
     * Returns the min cluster size.
     * @return {number} The grid size.
     */
    getMinClusterSize() {
        return this.minClusterSize_;
    }
    ;
    /**
     * Sets the min cluster size.
     * @param {number} size The grid size.
     */
    setMinClusterSize(size) {
        this.minClusterSize_ = size;
    }
    ;
    /**
     * Extends a bounds object by the grid size.
     * @param {google.maps.LatLngBounds} bounds The bounds to extend.
     * @return {google.maps.LatLngBounds} The extended bounds.
     */
    getExtendedBounds(bounds) {
        var projection = this.getProjection();
        // Turn the bounds into latlng.
        var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
        var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());
        // Convert the points to pixels and the extend out by the grid size.
        var trPix = projection.fromLatLngToDivPixel(tr);
        trPix.x += this.gridSize_;
        trPix.y -= this.gridSize_;
        var blPix = projection.fromLatLngToDivPixel(bl);
        blPix.x -= this.gridSize_;
        blPix.y += this.gridSize_;
        // Convert the pixel points back to LatLng
        var ne = projection.fromDivPixelToLatLng(trPix);
        var sw = projection.fromDivPixelToLatLng(blPix);
        // Extend the bounds to contain the new bounds.
        bounds.extend(ne);
        bounds.extend(sw);
        return bounds;
    }
    ;
    /**
     * Determins if a marker is contained in a bounds.
     * @param {google.maps.Marker} marker The marker to check.
     * @param {google.maps.LatLngBounds} bounds The bounds to check against.
     * @return {boolean} True if the marker is in the bounds.
     * @private
     */
    isMarkerInBounds_(marker, bounds) {
        return bounds.contains(marker.getPosition());
    }
    ;
    /**
     * Clears all clusters and markers from the clusterer.
     */
    clearMarkers() {
        this.resetViewport(true);
        // Set the markers a empty array.
        this.markers_ = [];
    }
    ;
    /**
     * Clears all existing clusters and recreates them.
     * @param {boolean} opt_hide To also hide the marker.
     */
    resetViewport(opt_hide = false) {
        // Remove all the clusters
        for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
            cluster.remove();
        }
        // Reset the markers to not be added and to be invisible.
        for (var i = 0, marker; marker = this.markers_[i]; i++) {
            marker.isAdded = false;
            if (opt_hide) {
                marker.setMap(null);
            }
        }
        this.clusters_ = [];
    }
    ;
    repaint() {
        var oldClusters = this.clusters_.slice();
        this.clusters_.length = 0;
        this.resetViewport();
        this.redraw();
        // Remove the old clusters.
        // Do it in a timeout so the other clusters have been drawn first.
        window.setTimeout(function () {
            for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
                cluster.remove();
            }
        }, 0);
    }
    ;
    /**
     * Redraws the clusters.
     */
    redraw() {
        this.createClusters_();
    }
    ;
    /**
     * Calculates the distance between two latlng locations in km.
     * @see http://www.movable-type.co.uk/scripts/latlong.html
     * @param {google.maps.LatLng} p1 The first lat lng point.
     * @param {google.maps.LatLng} p2 The second lat lng point.
     * @return {number} The distance between the two points in km.
     * @private
    */
    distanceBetweenPoints_(p1, p2) {
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
    }
    ;
    /**
     * Add a marker to a cluster, or creates a new cluster.
     * @param {google.maps.Marker} marker The marker to add.
     * @private
     */
    addToClosestCluster_(marker) {
        var distance = 40000; // Some large number
        var clusterToAddTo = null;
        var pos = marker.getPosition();
        for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
            var center = cluster.getCenter();
            if (center) {
                var d = this.distanceBetweenPoints_(center, marker.getPosition());
                if (d < distance) {
                    distance = d;
                    clusterToAddTo = cluster;
                }
            }
        }
        if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
            clusterToAddTo.addMarker(marker);
        }
        else {
            var cluster = new cluster_1.Cluster(this);
            cluster.addMarker(marker);
            this.clusters_.push(cluster);
        }
    }
    ;
    /**
     * Creates the clusters.
     * @private
     */
    createClusters_() {
        if (!this.ready_) {
            return;
        }
        // Get our current map view bounds.
        // Create a new bounds object so we don't affect the map.
        var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
        var bounds = this.getExtendedBounds(mapBounds);
        for (var i = 0, marker; marker = this.markers_[i]; i++) {
            if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
                this.addToClosestCluster_(marker);
            }
        }
        for (let i = 0; i < this.clusters_.length; i++) {
            this.clusters_[i].updateIcon();
        }
    }
    ;
}
exports.MarkerClusterer = MarkerClusterer;
//# sourceMappingURL=marker-clusterer.js.map