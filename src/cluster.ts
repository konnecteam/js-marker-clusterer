import { ClusterIcon } from './cluster-icon';
/**
 * A cluster that contains markers.
 */
export class Cluster {

    markerClusterer_ = null;
    map_ = null;
    gridSize_ = null;
    minClusterSize_ = null;
    averageCenter_ = null;
    center_ = null;
    markers_ = [];
    bounds_ = null;
    clusterIcon_ = null;

    /**
     *  @param {MarkerClusterer} markerClusterer The markerclusterer that this
     *     cluster is associated with.
     */
    constructor(markerClusterer) {
        this.markerClusterer_ = markerClusterer;
        this.map_ = markerClusterer.getMap();
        this.gridSize_ = markerClusterer.getGridSize();
        this.minClusterSize_ = markerClusterer.getMinClusterSize();
        this.averageCenter_ = markerClusterer.isAverageCenter();
        this.center_ = null;
        this.markers_ = [];
        this.bounds_ = null;
        this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
    }


    /**
     * Determins if a marker is already added to the cluster.
     * @param {google.maps.Marker} marker The marker to check.
     * @return {boolean} True if the marker is already added.
     */
    isMarkerAlreadyAdded(marker) {
        if (this.markers_.indexOf) {
            return this.markers_.indexOf(marker) != -1;
        } else {
            for (var i = 0, m; m = this.markers_[i]; i++) {
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

        if (!this.center_) {
            this.center_ = marker.getPosition();
            this.calculateBounds_();
        } else {
            if (this.averageCenter_) {
                var l = this.markers_.length + 1;
                var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
                var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
                this.center_ = new google.maps.LatLng(lat, lng);
                this.calculateBounds_();
            }
        }

        marker.isAdded = true;
        this.markers_.push(marker);

        var len = this.markers_.length;
        if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
            // Min cluster size not reached so show the marker.
            marker.setMap(this.map_);
        }

        if (len == this.minClusterSize_) {
            // Hide the markers that were showing.
            for (var i = 0; i < len; i++) {
                this.markers_[i].setMap(null);
            }
        }

        if (len >= this.minClusterSize_) {
            marker.setMap(null);
        }

        this.updateIcon();
        return true;
    };

    /**
     * Returns the marker clusterer that the cluster is associated with.
     * @return {MarkerClusterer} The associated marker clusterer.
     */
    getMarkerClusterer() {
        return this.markerClusterer_;
    };

    /**
     * Returns the bounds of the cluster.
     * @return {google.maps.LatLngBounds} the cluster bounds.
     */
    getBounds() {
        var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
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
        this.clusterIcon_.remove();
        this.markers_.length = 0;
        delete this.markers_;
    };

    /**
     * Returns the center of the cluster.
     * @return {number} The cluster center.
     */
    getSize() {
        return this.markers_.length;
    };

    /**
     * Returns the center of the cluster.
     * @return {Array.<google.maps.Marker>} The cluster center.
     */
    getMarkers() {
        return this.markers_;
    };

    /**
     * Returns the center of the cluster.
     * @return {google.maps.LatLng} The cluster center.
     */
    getCenter() {
        return this.center_;
    };

    /**
     * Calculated the extended bounds of the cluster with the grid.
     * @private
     */
    calculateBounds_() {
        var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
        this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
    };


    /**
     * Determines if a marker lies in the clusters bounds.
     *
     * @param {google.maps.Marker} marker The marker to check.
     * @return {boolean} True if the marker lies in the bounds.
     */
    isMarkerInClusterBounds(marker) {
        return this.bounds_.contains(marker.getPosition());
    };

    /**
     * Returns the map that the cluster is associated with.
     * @return {google.maps.Map} The map.
     */
    getMap() {
        return this.map_;
    };


    /**
     * Updates the cluster icon
     */
    updateIcon() {
        var zoom = this.map_.getZoom();
        var mz = this.markerClusterer_.getMaxZoom();

        if (mz && zoom > mz) {
            // The zoom is greater than our max zoom so show all the markers in cluster.
            for (var i = 0, marker; marker = this.markers_[i]; i++) {
                marker.setMap(this.map_);
            }
            return;
        }

        if (this.markers_.length < this.minClusterSize_) {
            // Min cluster size not yet reached.
            this.clusterIcon_.hide();
            return;
        }

        var numStyles = this.markerClusterer_.getStyles().length;
        var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
        this.clusterIcon_.setCenter(this.center_);
        this.clusterIcon_.setSums(sums);
        this.clusterIcon_.show();
    };
}
