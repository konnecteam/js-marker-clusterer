"use strict";
class ClusterIcon {
    /**
     * A cluster icon
     *
     * @param {Cluster} cluster The cluster to be associated with.
     * @param {Object} styles An object that has style properties:
     *     'url': (string) The image url.
     *     'height': (number) The image height.
     *     'width': (number) The image width.
     *     'anchor': (Array) The anchor position of the label text.
     *     'textColor': (string) The text color.
     *     'textSize': (number) The text size.
     *     'backgroundPosition: (string) The background postition x, y.
     * @param {number=} opt_padding Optional padding to apply to the cluster icon.
     * @constructor
     * @extends google.maps.OverlayView
     * @ignore
     */
    constructor(cluster, styles, opt_padding) {
        this._styles = null;
        this._padding = 0;
        this._cluster = null;
        this._center = null;
        this._map = null;
        this._div = null;
        this._sums = null;
        this._visible = false;
        this._text = "";
        this._index = null;
        this._iconAnchor = null;
        this._width = 0;
        this._height = 0;
        this._url = "";
        this._textColor = "";
        this._anchor = null;
        this._textSize = null;
        this._backgroundPosition = null;
        cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);
        this._styles = styles;
        this._padding = opt_padding || 0;
        this._cluster = cluster;
        this._center = null;
        this._map = cluster.getMap();
        this._div = null;
        this._sums = null;
        this._visible = false;
        this.setMap(this._map);
    }
    /**
   * Triggers the clusterclick event and zoom's if the option is set.
   * @param {google.maps.MouseEvent} event The event to propagate
   */
    triggerClusterClick(event) {
        var markerClusterer = this._cluster.getMarkerClusterer();
        // Trigger the clusterclick event.
        google.maps.event.trigger(markerClusterer, 'clusterclick', this._cluster, event);
        if (markerClusterer.isZoomOnClick()) {
            // Zoom into the cluster.
            this._map.fitBounds(this._cluster.getBounds());
            //Specific actions to do when the max zoom is reached AND there is still a cluster
            if (!this.maxZoomReached() && markerClusterer.maxZoomReachedCb !== null) {
                //Max zoom reached, we call the callback to do some specfic actions
                markerClusterer.maxZoomReachedCb(this._cluster);
            }
        }
    }
    ;
    /**
     * Adding the cluster icon to the dom.
     * @ignore
     */
    onAdd() {
        this._div = document.createElement('DIV');
        if (this._visible) {
            var pos = this.getPosFromLatLng_(this._center);
            this._div.style.cssText = this.createCss(pos);
            this._div.innerHTML = this._sums.text;
        }
        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this._div);
        var that = this;
        var isDragging = false;
        google.maps.event.addDomListener(this._div, 'click', function (event) {
            // Only perform click when not preceded by a drag
            if (!isDragging) {
                that.triggerClusterClick(event);
            }
        });
        google.maps.event.addDomListener(this._div, 'mousedown', function () {
            isDragging = false;
        });
        google.maps.event.addDomListener(this._div, 'mousemove', function () {
            isDragging = true;
        });
    }
    ;
    /**
     * Returns the position to place the div dending on the latlng.
     * @param {google.maps.LatLng} latlng The position in latlng.
     * @return {google.maps.Point} The position in pixels.
     * @private
     */
    getPosFromLatLng_(latlng) {
        var pos = this.getProjection().fromLatLngToDivPixel(latlng);
        if (typeof this._iconAnchor === 'object' && this._iconAnchor.length === 2) {
            pos.x -= this._iconAnchor[0];
            pos.y -= this._iconAnchor[1];
        }
        else {
            pos.x -= this._width / 2;
            pos.y -= this._height / 2;
        }
        return pos;
    }
    ;
    /**
     * Draw the icon.
     * @ignore
     */
    draw() {
        if (this._visible) {
            var pos = this.getPosFromLatLng_(this._center);
            this._div.style.top = pos.y + 'px';
            this._div.style.left = pos.x + 'px';
        }
    }
    ;
    /**
     * Hide the icon.
     */
    hide() {
        if (this._div) {
            this._div.style.display = 'none';
        }
        this._visible = false;
    }
    ;
    /**
     * Position and show the icon.
     */
    show() {
        if (this._div) {
            var pos = this.getPosFromLatLng_(this._center);
            this._div.style.cssText = this.createCss(pos);
            this._div.style.display = '';
        }
        this._visible = true;
    }
    ;
    /**
     * Remove the icon from the map
     */
    remove() {
        this.setMap(null);
    }
    ;
    /**
     * Implementation of the onRemove interface.
     * @ignore
     */
    onRemove() {
        if (this._div && this._div.parentNode) {
            this.hide();
            this._div.parentNode.removeChild(this._div);
            this._div = null;
        }
    }
    ;
    /**
     * Set the sums of the icon.
     * @param {Object} sums The sums containing:
     *   'text': (string) The text to display in the icon.
     *   'index': (number) The style index of the icon.
     */
    setSums(sums) {
        this._sums = sums;
        this._text = sums.text;
        this._index = sums.index;
        if (this._div) {
            this._div.innerHTML = sums.text;
        }
        this.useStyle();
    }
    ;
    /**
     * Sets the icon to the the styles.
     */
    useStyle() {
        var index = Math.max(0, this._sums.index - 1);
        index = Math.min(this._styles.length - 1, index);
        var style = this._styles[index];
        this._url = style['url'];
        this._height = style['height'];
        this._width = style['width'];
        this._textColor = style['textColor'];
        this._anchor = style['anchor'];
        this._textSize = style['textSize'];
        this._backgroundPosition = style['backgroundPosition'];
        this._iconAnchor = style['iconAnchor'];
    }
    ;
    /**
     * Sets the center of the icon.
     * @param {google.maps.LatLng} center The latlng to set as the center.
     */
    setCenter(center) {
        this._center = center;
    }
    ;
    /**
     * Can the map be zoomed more ?
     */
    maxZoomReached() {
        if (this._cluster.getMarkerClusterer().getMaxZoom() === this._map.getZoom()) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * Create the css text based on the position of the icon.
     * @param {google.maps.Point} pos The position.
     * @return {string} The css style text.
     */
    createCss(pos) {
        var style = [];
        style.push('background-image:url(' + this._url + ');');
        var backgroundPosition = this._backgroundPosition ? this._backgroundPosition : '0 0';
        style.push('background-position:' + backgroundPosition + ';');
        if (typeof this._anchor === 'object') {
            if (typeof this._anchor[0] === 'number' && this._anchor[0] > 0 &&
                this._anchor[0] < this._height) {
                style.push('height:' + (this._height - this._anchor[0]) +
                    'px; padding-top:' + this._anchor[0] + 'px;');
            }
            else if (typeof this._anchor[0] === 'number' && this._anchor[0] < 0 &&
                -this._anchor[0] < this._height) {
                style.push('height:' + this._height + 'px; line-height:' + (this._height + this._anchor[0]) +
                    'px;');
            }
            else {
                style.push('height:' + this._height + 'px; line-height:' + this._height +
                    'px;');
            }
            if (typeof this._anchor[1] === 'number' && this._anchor[1] > 0 &&
                this._anchor[1] < this._width) {
                style.push('width:' + (this._width - this._anchor[1]) +
                    'px; padding-left:' + this._anchor[1] + 'px;');
            }
            else {
                style.push('width:' + this._width + 'px; text-align:center;');
            }
        }
        else {
            style.push('height:' + this._height + 'px; line-height:' +
                this._height + 'px; width:' + this._width + 'px; text-align:center;');
        }
        var txtColor = this._textColor ? this._textColor : 'black';
        var txtSize = this._textSize ? this._textSize : 11;
        style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
            pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
            txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
        return style.join('');
    }
    ;
}
exports.ClusterIcon = ClusterIcon;
//# sourceMappingURL=cluster-icon.js.map