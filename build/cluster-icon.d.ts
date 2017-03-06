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
export declare class ClusterIcon {
    _styles: any;
    _padding: number;
    _cluster: any;
    _center: any;
    _map: any;
    _div: any;
    _sums: any;
    _visible: boolean;
    _text: string;
    _index: any;
    _iconAnchor: any;
    _width: number;
    _height: number;
    _url: string;
    _textColor: string;
    _anchor: any;
    _textSize: any;
    _backgroundPosition: any;
    constructor(cluster: any, styles: any, opt_padding: any);
    /**
   * Triggers the clusterclick event and zoom's if the option is set.
   * @param {google.maps.MouseEvent} event The event to propagate
   */
    triggerClusterClick(event: any): void;
    /**
     * Adding the cluster icon to the dom.
     * @ignore
     */
    onAdd(): void;
    /**
     * Returns the position to place the div dending on the latlng.
     * @param {google.maps.LatLng} latlng The position in latlng.
     * @return {google.maps.Point} The position in pixels.
     * @private
     */
    _getPosFromLatLng(latlng: any): any;
    /**
     * Draw the icon.
     * @ignore
     */
    draw(): void;
    /**
     * Hide the icon.
     */
    hide(): void;
    /**
     * Position and show the icon.
     */
    show(): void;
    /**
     * Remove the icon from the map
     */
    remove(): void;
    /**
     * Implementation of the onRemove interface.
     * @ignore
     */
    onRemove(): void;
    /**
     * Set the sums of the icon.
     * @param {Object} sums The sums containing:
     *   'text': (string) The text to display in the icon.
     *   'index': (number) The style index of the icon.
     */
    setSums(sums: any): void;
    /**
     * Sets the icon to the the styles.
     */
    useStyle(): void;
    /**
     * Sets the center of the icon.
     * @param {google.maps.LatLng} center The latlng to set as the center.
     */
    setCenter(center: any): void;
    /**
     * Create the css text based on the position of the icon.
     * @param {google.maps.Point} pos The position.
     * @return {string} The css style text.
     */
    createCss(pos: any): string;
}
