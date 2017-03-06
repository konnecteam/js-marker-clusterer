import { ClusterIcon } from './cluster-icon';
/**
 * A cluster that contains markers.
 */
export class Cluster {

    _markerClusterer = null;
    _map = null;
    _gridSize = null;
    _minClusterSize = null;
    _averageCenter = null;
    _center = null;
    _markers = [];
    _bounds = null;
    _clusterIcon = null;

    /**
     *  @param {MarkerClusterer} markerClusterer The markerclusterer that this
     *     cluster is associated with.
     */
    constructor(markerClusterer) {
        this._markerClusterer = markerClusterer;
        this._map = markerClusterer.getMap();
        this._gridSize = markerClusterer.getGridSize();
        this._minClusterSize = markerClusterer.getMinClusterSize();
        this._averageCenter = markerClusterer.isAverageCenter();
        this._center = null;
        this._markers = [];
        this._bounds = null;
        this._clusterIcon = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
    }


    /**
     * Determins if a marker is already added to the cluster.
     * @param {google.maps.Marker} marker The marker to check.
     * @return {boolean} True if the marker is already added.
     */
    isMarkerAlreadyAdded(marker) {
        if (this._markers.indexOf) {
            return this._markers.indexOf(marker) != -1;
        } else {
            for (var i = 0, m; m = this._markers[i]; i++) {
                if (m == marker) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Add a marker the cluster.
     * @param {google.maps.Marker} marker The marker to add.
     * @return {boolean} True if the marker was added.
     */
    addMarker(marker) {
        if (this.isMarkerAlreadyAdded(marker)) {
            return false;
        }

        if (!this._center) {
            this._center = marker.getPosition();
            this.calculateBounds();
        } else {
            if (this._averageCenter) {
                var l = this._markers.length + 1;
                var lat = (this._center.lat() * (l - 1) + marker.getPosition().lat()) / l;
                var lng = (this._center.lng() * (l - 1) + marker.getPosition().lng()) / l;
                this._center = new google.maps.LatLng(lat, lng);
                this.calculateBounds();
            }
        }

        marker.isAdded = true;
        this._markers.push(marker);

        var len = this._markers.length;
        if (len < this._minClusterSize && marker.getMap() != this._map) {
            // Min cluster size not reached so show the marker.
            marker.setMap(this._map);
        }

        if (len == this._minClusterSize) {
            // Hide the markers that were showing.
            for (var i = 0; i < len; i++) {
                this._markers[i].setMap(null);
            }
        }

        if (len >= this._minClusterSize) {
            marker.setMap(null);
        }

        /**
         * ggrimbert, this is done later in createCluster
         * avoids calling updateIcon for each marker
         */
        // this.updateIcon(); 
        return true;
    };

    /**
     * Returns the marker clusterer that the cluster is associated with.
     * @return {MarkerClusterer} The associated marker clusterer.
     */
    getMarkerClusterer() {
        return this._markerClusterer;
    };

    /**
     * Returns the bounds of the cluster.
     * @return {google.maps.LatLngBounds} the cluster bounds.
     */
    getBounds() {
        var bounds = new google.maps.LatLngBounds(this._center, this._center);
        var markers = this.getMarkers();
        for (var i = 0, marker; marker = markers[i]; i++) {
            bounds.extend(marker.getPosition());
        }
        return bounds;
    };

    /**
     * Removes the cluster
     */
    remove() {
        this._clusterIcon.remove();
        this._markers.length = 0;
        delete this._markers;
    };

    /**
     * Returns the center of the cluster.
     * @return {number} The cluster center.
     */
    getSize() {
        return this._markers.length;
    };

    /**
     * Returns the center of the cluster.
     * @return {Array.<google.maps.Marker>} The cluster center.
     */
    getMarkers() {
        return this._markers;
    };

    /**
     * Returns the center of the cluster.
     * @return {google.maps.LatLng} The cluster center.
     */
    getCenter() {
        return this._center;
    };

    /**
     * Calculated the extended bounds of the cluster with the grid.
     * @private
     */
    calculateBounds() {
        var bounds = new google.maps.LatLngBounds(this._center, this._center);
        this._bounds = this._markerClusterer.getExtendedBounds(bounds);
    };


    /**
     * Determines if a marker lies in the clusters bounds.
     *
     * @param {google.maps.Marker} marker The marker to check.
     * @return {boolean} True if the marker lies in the bounds.
     */
    isMarkerInClusterBounds(marker) {
        return this._bounds.contains(marker.getPosition());
    };

    /**
     * Returns the map that the cluster is associated with.
     * @return {google.maps.Map} The map.
     */
    getMap() {
        return this._map;
    };


    /**
     * Updates the cluster icon
     */
    updateIcon() {
        var zoom = this._map.getZoom();
        var mz = this._markerClusterer.getMaxZoom();

        if (mz && zoom > mz) {
            // The zoom is greater than our max zoom so show all the markers in cluster.
            for (var i = 0, marker; marker = this._markers[i]; i++) {
                marker.setMap(this._map);
            }
            return;
        }

        if (this._markers.length < this._minClusterSize) {
            // Min cluster size not yet reached.
            this._clusterIcon.hide();
            return;
        }

        var numStyles = this._markerClusterer.getStyles().length;
        var sums = this._markerClusterer.getCalculator()(this._markers, numStyles);
        this._clusterIcon.setCenter(this._center);
        this._clusterIcon.setSums(sums);
        this._clusterIcon.show();
    };
}
