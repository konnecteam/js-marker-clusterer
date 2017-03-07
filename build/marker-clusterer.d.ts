/// <reference types="googlemaps" />
import { Cluster } from './cluster';
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
export declare class MarkerClusterer {
    _map: any;
    _markers: Array<google.maps.Marker>;
    _clusters: Array<Cluster>;
    sizes: any[];
    _styles: any[];
    _ready: boolean;
    _gridSize: number;
    _minClusterSize: number;
    _maxZoom: number;
    _imagePath: string;
    _imageExtension: string;
    _MARKER_CLUSTER_IMAGE_PATH: string;
    _MARKER_CLUSTER_IMAGE_EXTENSION: string;
    _zoomOnClick: boolean;
    _averageCenter: boolean;
    _prevZoom: number;
    maxZoomReachedCb: Function;
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
    constructor(map: any, opt_markers: any, opt_options: any);
    extend(obj1: any, obj2: any): any;
    /**
     * Implementaion of the interface method.
     * @ignore
     */
    onAdd(): void;
    /**
     * Implementaion of the interface method.
     * @ignore
     */
    draw(): void;
    /**
     * Sets up the styles object.
     * @private
     */
    setupStyles(): void;
    /**
     *  Fit the map to the bounds of the markers in the clusterer.
     */
    fitMapToMarkers(): void;
    /**
     *  Sets the styles.
     *  @param {Object} styles The style to set.
     */
    setStyles(styles: any): void;
    /**
     *  Gets the styles.
     *  @return {Object} The styles object.
     */
    getStyles(): any[];
    /**
     * Whether zoom on click is set.
     * @return {boolean} True if _zoomOnClick is set.
     */
    isZoomOnClick(): boolean;
    /**
     * Whether average center is set.
     * @return {boolean} True if _averageCenter is set.
     */
    isAverageCenter(): boolean;
    /**
     *  Returns the array of markers in the clusterer.
     *  @return {Array.<google.maps.Marker>} The markers.
     */
    getMarkers(): google.maps.Marker[];
    /**
     *  Returns the number of markers in the clusterer
     *  @return {Number} The number of markers.
     */
    getTotalMarkers(): number;
    /**
     *  Sets the max zoom for the clusterer.
     *  @param {number} maxZoom The max zoom level.
     */
    setMaxZoom(maxZoom: any): void;
    /**
     *  Gets the max zoom for the clusterer.
     *  @return {number} The max zoom level.
     */
    getMaxZoom(): number;
    /**
     *  The function for calculating the cluster icon image.
     *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
     *  @param {number} numStyles The number of styles available.
     *  @return {Object} A object properties: 'text' (string) and 'index' (number).
     *  @private
     */
    _calculator(markers: any, numStyles: any): {
        text: any;
        index: number;
    };
    /**
     * Set the calculator function.
     * @param {function(Array, number)} calculator The function to set as the
     *     calculator. The function should return a object properties:
     *     'text' (string) and 'index' (number).
     */
    setCalculator(calculator: any): void;
    /**
     * Get the calculator function.
     * @return {function(Array, number)} the calculator function.
     */
    getCalculator(): (markers: any, numStyles: any) => {
        text: any;
        index: number;
    };
    /**
     * Add an array of markers to the clusterer.
     * @param {Array.<google.maps.Marker>} markers The markers to add.
     * @param {boolean=} opt_nodraw Whether to redraw the clusters.
     */
    addMarkers(markers: any, opt_nodraw: any): void;
    /**
     * Pushes a marker to the clusterer.
     * @param {google.maps.Marker} marker The marker to add.
     * @private
     */
    _pushMarkerTo(marker: any): void;
    /**
     * Adds a marker to the clusterer and redraws if needed.
     * @param {google.maps.Marker} marker The marker to add.
     * @param {boolean=} opt_nodraw Whether to redraw the clusters.
     */
    addMarker(marker: any, opt_nodraw: any): void;
    /**
     * Removes a marker and returns true if removed, false if not
     * @param {google.maps.Marker} marker The marker to remove
     * @return {boolean} Whether the marker was removed or not
     * @private
     */
    _removeMarker(marker: any, idx?: number): boolean;
    /**
     * Remove a marker from the cluster.
     * @param {google.maps.Marker} marker The marker to remove.
     * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
     * @return {boolean} True if the marker was removed.
     */
    removeMarker(marker: any, opt_nodraw: any): boolean;
    /**
     * Removes an array of markers from the cluster.
     * @param {Array.<google.maps.Marker>} markers The markers to remove.
     * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
     */
    removeMarkers(markers: any, opt_nodraw: any): boolean;
    /**
     * Sets the clusterer's ready state.
     * @param {boolean} ready The state.
     * @private
     */
    setReady(ready: any): void;
    /**
     * Returns the number of clusters in the clusterer.
     * @return {number} The number of clusters.
     */
    getTotalClusters(): number;
    /**
     * Returns the google map that the clusterer is associated with.
     * @return {google.maps.Map} The map.
     */
    getMap(): any;
    /**
     * Sets the google map that the clusterer is associated with.
     * @param {google.maps.Map} map The map.
     */
    setMap(map: any): void;
    /**
     * Returns the size of the grid.
     * @return {number} The grid size.
     */
    getGridSize(): number;
    /**
     * Sets the size of the grid.
     * @param {number} size The grid size.
     */
    setGridSize(size: any): void;
    /**
     * Returns the min cluster size.
     * @return {number} The grid size.
     */
    getMinClusterSize(): number;
    /**
     * Sets the min cluster size.
     * @param {number} size The grid size.
     */
    setMinClusterSize(size: any): void;
    /**
     * Extends a bounds object by the grid size.
     * @param {google.maps.LatLngBounds} bounds The bounds to extend.
     * @return {google.maps.LatLngBounds} The extended bounds.
     */
    getExtendedBounds(bounds: any): any;
    /**
     * Determins if a marker is contained in a bounds.
     * @param {google.maps.Marker} marker The marker to check.
     * @param {google.maps.LatLngBounds} bounds The bounds to check against.
     * @return {boolean} True if the marker is in the bounds.
     * @private
     */
    _isMarkerInBounds(marker: any, bounds: any): any;
    /**
     * Clears all clusters and markers from the clusterer.
     */
    clearMarkers(): void;
    /**
     * Clears all existing clusters and recreates them.
     * @param {boolean} opt_hide To also hide the marker.
     */
    resetViewport(opt_hide?: boolean): void;
    repaint(): void;
    /**
     * Redraws the clusters.
     */
    redraw(): void;
    /**
     * Calculates the distance between two latlng locations in km.
     * @see http://www.movable-type.co.uk/scripts/latlong.html
     * @param {google.maps.LatLng} p1 The first lat lng point.
     * @param {google.maps.LatLng} p2 The second lat lng point.
     * @return {number} The distance between the two points in km.
     * @private
    */
    _distanceBetweenPoints(p1: any, p2: any): number;
    /**
     * Add a marker to a cluster, or creates a new cluster.
     * @param {google.maps.Marker} marker The marker to add.
     * @private
     */
    _addToClosestCluster(marker: any): void;
    /**
     * Creates the clusters.
     * @private
     */
    createClusters(): void;
}
