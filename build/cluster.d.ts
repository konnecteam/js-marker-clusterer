/// <reference types="googlemaps" />
/**
 * A cluster that contains markers.
 */
export declare class Cluster {
    _markerClusterer: any;
    _map: any;
    _gridSize: any;
    _minClusterSize: any;
    _averageCenter: any;
    _center: any;
    _markers: any[];
    _bounds: any;
    _clusterIcon: any;
    /**
     *  @param {MarkerClusterer} markerClusterer The markerclusterer that this
     *     cluster is associated with.
     */
    constructor(markerClusterer: any);
    /**
     * Determins if a marker is already added to the cluster.
     * @param {google.maps.Marker} marker The marker to check.
     * @return {boolean} True if the marker is already added.
     */
    isMarkerAlreadyAdded(marker: any): boolean;
    /**
     * Add a marker the cluster.
     * @param {google.maps.Marker} marker The marker to add.
     * @return {boolean} True if the marker was added.
     */
    addMarker(marker: any): boolean;
    /**
     * Returns the marker clusterer that the cluster is associated with.
     * @return {MarkerClusterer} The associated marker clusterer.
     */
    getMarkerClusterer(): any;
    /**
     * Returns the bounds of the cluster.
     * @return {google.maps.LatLngBounds} the cluster bounds.
     */
    getBounds(): google.maps.LatLngBounds;
    /**
     * Removes the cluster
     */
    remove(): void;
    /**
     * Returns the center of the cluster.
     * @return {number} The cluster center.
     */
    getSize(): number;
    /**
     * Returns the center of the cluster.
     * @return {Array.<google.maps.Marker>} The cluster center.
     */
    getMarkers(): any[];
    /**
     * Returns the center of the cluster.
     * @return {google.maps.LatLng} The cluster center.
     */
    getCenter(): any;
    /**
     * Calculated the extended bounds of the cluster with the grid.
     * @private
     */
    calculateBounds(): void;
    /**
     * Determines if a marker lies in the clusters bounds.
     *
     * @param {google.maps.Marker} marker The marker to check.
     * @return {boolean} True if the marker lies in the bounds.
     */
    isMarkerInClusterBounds(marker: any): any;
    /**
     * Returns the map that the cluster is associated with.
     * @return {google.maps.Map} The map.
     */
    getMap(): any;
    /**
     * Updates the cluster icon
     */
    updateIcon(): void;
}
