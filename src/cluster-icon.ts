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

export class ClusterIcon extends google.maps.OverlayView {

    styles_ = null;
    padding_ = 0;
    cluster_ = null;
    center_ = null;
    map_ = null;
    div_ = null;
    sums_ = null;
    visible_ = false;
    text_ = "";
    index_ = null;
    iconAnchor_ = null;
    width_: number = 0;
    height_: number = 0;
    url_: string = "";
    textColor_: string = "";
    anchor_ = null;
    textSize_ = null;
    backgroundPosition_ = null;

    constructor(cluster, styles, opt_padding) {
        super();
        this.styles_ = styles;
        this.padding_ = opt_padding || 0;
        this.cluster_ = cluster;
        this.center_ = null;
        this.map_ = cluster.getMap();
        this.div_ = null;
        this.sums_ = null;
        this.visible_ = false;

        this.setMap(this.map_);
    }

    /**
   * Triggers the clusterclick event and zoom's if the option is set.
   * @param {google.maps.MouseEvent} event The event to propagate
   */
    triggerClusterClick(event) {
        var markerClusterer = this.cluster_.getMarkerClusterer();

        // Trigger the clusterclick event.
        google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_, event);

        if (markerClusterer.isZoomOnClick()) {
            // Zoom into the cluster.
            this.map_.fitBounds(this.cluster_.getBounds());
        }
    };

    /**
     * Adding the cluster icon to the dom.
     * @ignore
     */
    onAdd() {
        this.div_ = document.createElement('DIV');
        if (this.visible_) {
            var pos = this.getPosFromLatLng_(this.center_);
            this.div_.style.cssText = this.createCss(pos);
            this.div_.innerHTML = this.sums_.text;
        }

        var panes = this.getPanes();
        panes.overlayMouseTarget.appendChild(this.div_);

        var that = this;
        var isDragging = false;
        google.maps.event.addDomListener(this.div_, 'click', function (event) {
            // Only perform click when not preceded by a drag
            if (!isDragging) {
                that.triggerClusterClick(event);
            }
        });
        google.maps.event.addDomListener(this.div_, 'mousedown', function () {
            isDragging = false;
        });
        google.maps.event.addDomListener(this.div_, 'mousemove', function () {
            isDragging = true;
        });
    };

    /**
     * Returns the position to place the div dending on the latlng.
     * @param {google.maps.LatLng} latlng The position in latlng.
     * @return {google.maps.Point} The position in pixels.
     * @private
     */
    getPosFromLatLng_(latlng) {
        var pos = this.getProjection().fromLatLngToDivPixel(latlng);

        if (typeof this.iconAnchor_ === 'object' && this.iconAnchor_.length === 2) {
            pos.x -= this.iconAnchor_[0];
            pos.y -= this.iconAnchor_[1];
        } else {
            pos.x -= this.width_ / 2;
            pos.y -= this.height_ / 2;
        }
        return pos;
    };

    /**
     * Draw the icon.
     * @ignore
     */
    draw() {
        if (this.visible_) {
            var pos = this.getPosFromLatLng_(this.center_);
            this.div_.style.top = pos.y + 'px';
            this.div_.style.left = pos.x + 'px';
        }
    };

    /**
     * Hide the icon.
     */
    hide() {
        if (this.div_) {
            this.div_.style.display = 'none';
        }
        this.visible_ = false;
    };

    /**
     * Position and show the icon.
     */
    show() {
        if (this.div_) {
            var pos = this.getPosFromLatLng_(this.center_);
            this.div_.style.cssText = this.createCss(pos);
            this.div_.style.display = '';
        }
        this.visible_ = true;
    };

    /**
     * Remove the icon from the map
     */
    remove() {
        this.setMap(null);
    };

    /**
     * Implementation of the onRemove interface.
     * @ignore
     */
    onRemove() {
        if (this.div_ && this.div_.parentNode) {
            this.hide();
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
        }
    };

    /**
     * Set the sums of the icon.
     * @param {Object} sums The sums containing:
     *   'text': (string) The text to display in the icon.
     *   'index': (number) The style index of the icon.
     */
    setSums(sums) {
        this.sums_ = sums;
        this.text_ = sums.text;
        this.index_ = sums.index;
        if (this.div_) {
            this.div_.innerHTML = sums.text;
        }

        this.useStyle();
    };

    /**
     * Sets the icon to the the styles.
     */
    useStyle() {
        var index = Math.max(0, this.sums_.index - 1);
        index = Math.min(this.styles_.length - 1, index);
        var style = this.styles_[index];
        this.url_ = style['url'];
        this.height_ = style['height'];
        this.width_ = style['width'];
        this.textColor_ = style['textColor'];
        this.anchor_ = style['anchor'];
        this.textSize_ = style['textSize'];
        this.backgroundPosition_ = style['backgroundPosition'];
        this.iconAnchor_ = style['iconAnchor'];
    };

    /**
     * Sets the center of the icon.
     * @param {google.maps.LatLng} center The latlng to set as the center.
     */
    setCenter(center) {
        this.center_ = center;
    };

    /**
     * Create the css text based on the position of the icon.
     * @param {google.maps.Point} pos The position.
     * @return {string} The css style text.
     */
    createCss(pos) {
        var style = [];
        style.push('background-image:url(' + this.url_ + ');');
        var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
        style.push('background-position:' + backgroundPosition + ';');

        if (typeof this.anchor_ === 'object') {
            if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 &&
                this.anchor_[0] < this.height_) {
                style.push('height:' + (this.height_ - this.anchor_[0]) +
                    'px; padding-top:' + this.anchor_[0] + 'px;');
            } else if (typeof this.anchor_[0] === 'number' && this.anchor_[0] < 0 &&
                -this.anchor_[0] < this.height_) {
                style.push('height:' + this.height_ + 'px; line-height:' + (this.height_ + this.anchor_[0]) +
                    'px;');
            } else {
                style.push('height:' + this.height_ + 'px; line-height:' + this.height_ +
                    'px;');
            }
            if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 &&
                this.anchor_[1] < this.width_) {
                style.push('width:' + (this.width_ - this.anchor_[1]) +
                    'px; padding-left:' + this.anchor_[1] + 'px;');
            } else {
                style.push('width:' + this.width_ + 'px; text-align:center;');
            }
        } else {
            style.push('height:' + this.height_ + 'px; line-height:' +
                this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
        }

        var txtColor = this.textColor_ ? this.textColor_ : 'black';
        var txtSize = this.textSize_ ? this.textSize_ : 11;

        style.push('cursor:pointer; top:' + pos.y + 'px; left:' +
            pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' +
            txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
        return style.join('');
    };

}