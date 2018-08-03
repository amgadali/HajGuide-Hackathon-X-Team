/* ========================================================================
 Support.js v0.1 (dojo)
 * ========================================================================
 * Include Support Functions 
 *By Mohamed Taha 04/01/2018
 * ======================================================================== */
define([
    "esri/views/2d/draw/Draw",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/Polygon",
    "esri/geometry/geometryEngine",
    "dojo/_base/declare", "dojo/number",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",
    "dojo/_base/xhr",
    "dojo/_base/array",
    "dojo/domReady!"
], function (
    Draw,
    Map, MapView,
    Graphic,
    Polygon,
    geometryEngine, declare, number, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, xhr, Array) {
        var Support = declare(null, {
            constructor: function (options) {
                _this = this;
                _this.app = options.app;
            },
            //------GIS Functions
            GIS_BegainDraw: function (view) {
                view.graphics.removeAll();

                var draw = new Draw({
                    view: view
                });
                var action = draw.create("polygon");

                action.on("vertex-add", drawPolygon);

                // listen to cursor-update event on the action
                action.on("cursor-update", drawPolygon);

                // listen to vertex-remove event on the action
                action.on("vertex-remove", drawPolygon);

                // *******************************************
                // listen to draw-complete event on the action
                // *******************************************
                action.on("draw-complete", drawPolygon);
                function drawPolygon(evt) {
                    var vertices = evt.vertices;

                    //remove existing graphic
                    view.graphics.removeAll();

                    // create a new polygon
                    var polygon = new Polygon({
                        rings: vertices,
                        spatialReference: view.spatialReference
                    });

                    // create a new graphic representing the polygon, add it to the view
                    var graphic = new Graphic({
                        geometry: polygon,
                        symbol: {
                            type: "simple-fill", // autocasts as SimpleFillSymbol
                            color: [150, 200, 50, 0.4],
                            style: "solid",
                            outline: { // autocasts as SimpleLineSymbol
                                color: [100, 100, 100],
                                width: 2
                            }
                        }
                    });
                    view.graphics.add(graphic);

                    // calculate the area of the polygon
                    var area = geometryEngine.geodesicArea(polygon, "109404");
                    if (area < 0) {
                        // simplify the polygon if needed and calculate the area again
                        var simplifiedPolygon = geometryEngine.simplify(polygon);
                        if (simplifiedPolygon) {
                            area = geometryEngine.geodesicArea(simplifiedPolygon, "109404");
                        }
                    }
                    // start displaying the area of the polygon
                    var graphic = new Graphic({
                        geometry: polygon.centroid,
                        symbol: {
                            type: "text",
                            color: "Red",
                            haloColor: "black",
                            haloSize: "1px",
                            text: number.format(area, { places: 1 }) + "  م2",
                            xoffset: 3,
                            yoffset: 3,
                            font: { // autocast as Font
                                size: 9,
                                family: "sans-serif"

                            }
                        }
                    });
                    view.graphics.add(graphic);
                }
            },
            GIS_EraseDraw: function (view) {
                view.graphics.removeAll();
                _this.app.map.layers.items[2].graphics.removeAll()

            },
            ZoomToPolygon: function (Url, QueryText, ExpandFactor) {
                var queryTask = new QueryTask(Url);
                var query = new Query();
                query.returnGeometry = true;
                query.where = QueryText;
                queryTask.execute(query).then(function (featureSet) {
                    var items = Array.map(featureSet.features, function (feature) {
                        if (feature.geometry != null) {
                            // select the region.
                            var regionsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color([255, 0, 0]), 3), new Color([255, 255, 255, 0.0]));

                            var gra = feature;
                            gra.symbol = regionsymbol;

                            app.sceneView.goTo({
                                target: feature.geometry.extent.expand(ExpandFactor),
                                heading: 0,
                                tilt: 45
                            }, {
                                    animate: true
                                });
                            app.mapView.goTo({
                                target: feature.geometry.extent.expand(1),
                                heading: 0,
                                tilt: 45
                            }, {
                                    animate: true
                                });
                            _this.app.mapView.graphics.add(gra);
                            _this.app.sceneView.graphics.add(gra);
                        }
                    });
                });
            },

            //-------JavaScript Functions
            getParameterByName: function (name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
            copyTextToClipboard: function (text) {
                var textArea = document.createElement("textarea");

                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = 0;
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                document.body.removeChild(textArea);
            },
            getRootUrl: function () {
                return window.location.origin ? window.location.origin + '/' : window.location.protocol + '/' + window.location.host + '/';
            },
            Ajax: function (RequestURL, Paramter, TargetDropDownList, ReturenedData_ValueFiled, ReturenedData_TextField) {
                xhr.get({
                    // The URL of the request
                    url: RequestURL,
                    // Handle the result as JSON data
                    handleAs: "json",
                    // The success handler
                    content: {
                        ID: Paramter
                    },
                    load: function (jsonData) {
                        // Create a local var to append content to
                        var P = TargetDropDownList;
                        P.options.length = 0;
                        var opt = document.createElement('option');
                        opt.value = "";
                        opt.innerText = "--------";
                        opt.selected = false;
                        P.appendChild(opt);
                        // For every news item we received...
                        Array.forEach(jsonData, function (newsItem) {
                            var opt = document.createElement('option');
                            opt.value = newsItem[ReturenedData_ValueFiled];
                            opt.innerHTML = newsItem[ReturenedData_TextField];
                            opt.selected = false;
                            P.appendChild(opt);
                        });
                        // Set the content of the news node
                    },
                    // The error handler
                    error: function () {
                    }
                });
            }
        })
        return Support;
        // this function is called from the polygon draw action events
        // to provide a visual feedback to users as they are drawing a polygon


    });
