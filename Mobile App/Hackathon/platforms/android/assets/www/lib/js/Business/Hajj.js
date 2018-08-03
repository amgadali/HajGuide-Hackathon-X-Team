/* ========================================================================
 *Hajj Location Work: Hajj.js v0.1 (dojo)
 * ========================================================================
  *this module was developed from Riyad Hajj Maps using Esri Javascript APIs
 
 *By Mohamed Taha 03/06/2018
 * ======================================================================== */

define([
    // ArcGIS
    "dojo/_base/declare",
    "dojo/parser",
    "esri/Map",
    "esri/Basemap",
    "esri/layers/VectorTileLayer",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Search",
    "esri/widgets/Popup",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/widgets/LayerList",
    "esri/widgets/ColorPicker",
    "esri/core/watchUtils",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "esri/widgets/Print",
    "esri/layers/MapImageLayer",
    "esri/layers/FeatureLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/support/Query",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",

    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",
    "dojo/_base/array",
    "Hajj_Lib/Support",
    "esri/layers/GraphicsLayer",
    // Calcite Maps
    "calcite-maps/calcitemaps-v0.5",
    "calcite-maps/calcitemaps-arcgis-support-v0.5",
    //"calcite-maps/calcitemaps",
    "calcite-settings/panelsettings",
    "esri/views/2d/draw/Draw",
    "esri/geometry/Polygon",
    "esri/geometry/geometryEngine",
    "esri/Graphic",
    "esri/widgets/Compass",
    "dijit/Menu",
    "dijit/MenuItem",
    "dijit/CheckedMenuItem",
    "dijit/MenuSeparator",
    "dijit/PopupMenuItem",
    "esri/PopupTemplate",
    "dijit/Dialog",
    "dijit/registry",
    "esri/tasks/Locator",
    "esri/widgets/Locate",
    "esri/geometry/support/webMercatorUtils",
    "esri/widgets/BasemapToggle",
    "dojo/window",
    // Boostrap
    "bootstrap/Collapse",
    "bootstrap/Dropdown",
    "bootstrap/Tab",
    "bootstrap/Carousel",
    "bootstrap/Tooltip",
    "bootstrap/Modal",
    // Dojo
    "dojo/domReady!"
], function (declare, parser, Map, Basemap, VectorTileLayer, MapView, SceneView, Search, Popup, Home, Legend, LayerList, ColorPicker,
    watchUtils, query, domClass, dom, on, Print, MapImageLayer, FeatureLayer, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, Array, Support, GraphicsLayer, CalciteMapsSettings, CalciteMapsArcGISSupport, PanelSettings, Draw, Polygon, geometryEngine, Graphic,
    Compass, Menu, MenuItem, CheckedMenuItem, MenuSeparator, PopupMenuItem, PopupTemplate, Dialog, registry, Locator, Locate, webMercatorUtils, BasemapToggle, win) {

        var Hajj = declare(null, {
            constructor: function (options) {
                _this = this;
                _this.app = options.app;
                try {

                } catch (e) {

                }
            },
            GoTo: function (lat, long, zoom, view, Newbasemap) {
                view.goTo({
                    center: [Number(long), Number(lat)],
                    zoom: zoom
                }, {
                        animate: true
                    });
            },
            AddGraphics: function (gra) {
                _this.app.mapView.graphics.add(gra);
                _this.app.sceneView.graphics.add(gra);
            },
            RemoveGraphics: function () {
                _this.app.mapView.graphics.removeAll();
                _this.app.sceneView.graphics.removeAll();
            },
            CreatHajjFeatureLayer() {
                var lyr = new FeatureLayer({
                    url: _this.app.MapLayerURL + "/0",
                    maxScale: 0,
                    minScale: 0,
                    outFields: ["*"]
                });
                lyr.when(function (e) {
                    lyr.set({
                        popupTemplate: new PopupTemplate({
                            content: [
                                //{
                                //    type: "media",
                                //    mediaInfos: [{
                                //        title: "<b>نسبة المساحة الخضراء من المساحة الاجمالية</b>",
                                //        type: "pie-chart",
                                //        caption: "",
                                //        value: {
                                //            theme: "Tufte",
                                //            fields: ["Area", "GreenSurfaceArea"]
                                //        }
                                //    },
                                //    ]
                                //},
                                {
                                    type: "fields",
                                    fieldInfos: [
                                        {
                                            fieldName: "Location_Order",
                                            visible: true,
                                            label: "الترتيب:",
                                            format: {
                                                places: 0,
                                                digitSeparator: true
                                            }
                                        }
                                        ,
                                        {
                                            fieldName: "Name",
                                            visible: true,
                                            label: " الاسم   :"
                                        },
                                        {
                                            fieldName: "Area",
                                            visible: true,
                                            label: "المنطقة:"
                                        },
                                        {
                                            fieldName: "Start_date",
                                            visible: true,
                                            label: "تاريخ الدخول:"
                                        }
                                        ,
                                        {
                                            fieldName: "Start_Tilme",
                                            visible: true,
                                            label: " وقت الدخول :"
                                        }
                                        ,
                                        {
                                            fieldName: "End_Date",
                                            visible: true,
                                            label: "تاريخ الخروج :"
                                        }
                                        ,
                                        {
                                            fieldName: "End_Time",
                                            visible: true,
                                            label: "وقت الخروج:"
                                        }
                                        ,
                                        {
                                            fieldName: "days",
                                            visible: true,
                                            label: "عدد ايام المكوث :"
                                        },
                                        {
                                            fieldName: "Note",
                                            visible: true,
                                            label: "ملاحظات:"
                                        },
 

                                    ]
                                }],
                            title: lyr.title,
      
                            actions: [{
                                title: "نسخ رابط الموقع",
                                id: "CopyWhiteLand",
                                className: "esri-icon-link"
                            },
                            {
                                title: "جووجل",
                                id: "MOHgoogle",
                                className: "esri-icon-applications"
                            },
                            {
                                title: "مسار الوصول للموقع",
                                id: "MOHgoogleRout",
                                className: "esri-icon-navigation"
                            }]
                        })
                    });
                })
                return lyr;
            },
            CreateMapLayer() {
                var layer = new MapImageLayer({
                    url: _this.app.MapLayerURL
                    //,
                    //sublayers: [
                    //    {
                    //        id: 3,
                    //        visible: false,
                    //        title: "طبقة الاحياءالامانات"

                    //    }, {
                    //        id: 2,
                    //        visible: true,
                    //        title: "طبقة الامانات"

                    //    }, {
                    //        id: 1,
                    //        visible: true,
                    //        title: "طبقة حدود المواقع"

                    //    }, {
                    //        id: 0,
                    //        visible: false,
                    //        title: "طبقة المواقع"

                    //    }
                    //]
                });
                return layer;
            },
            FilterHajjFeatureLayerByType(Type) {
                var QueryText = null;
                _this.app.MapFeatureLayer.opacity = 1;

                switch (Type) {
                    case "All":
                        QueryText = "1=1";
                        break;
                    case "G":
                        QueryText = "Type_ID=1";
                        break;
                    case "P":
                        QueryText = "Type_ID=2";
                        break;
                    case "R":
                        QueryText = "Type_ID=3";
                        break;
                    case "S":
                        QueryText = "Type_ID=4";
                        break;
                    case "Y":
                        QueryText = "Type_ID=5";
                        break;
                    case "L":
                        QueryText = "Type_ID=6";
                        break;
                    case "Q":
                        QueryText = "Type_ID=9";
                        break;
                    case "No":
                        QueryText = "1=1";
                        _this.app.MapFeatureLayer.opacity = 0.1;
                        break;
                }
                _this.app.MapFeatureLayer.definitionExpression = QueryText;
            },
            TypeBaisedStatistcs: function (Park_Type, Label) {

                var Value1, Value2;
                switch (Park_Type) {
                    case "All":
                        Value1 = _this.app.Hajjtatistics.All;
                        Value2 = _this.app.MapStatistics.All;
                        Label = "المواقع"
                        break;
                    case "G":
                        Value1 = _this.app.Hajjtatistics.G;
                        Value2 = _this.app.MapStatistics.G;
                        break;
                    case "P":
                        Value1 = _this.app.Hajjtatistics.P;
                        Value2 = _this.app.MapStatistics.P;
                        break;
                    case "R":
                        Value1 = _this.app.Hajjtatistics.R;
                        Value2 = _this.app.MapStatistics.R;
                        break;
                    case "S":
                        Value1 = _this.app.Hajjtatistics.S;
                        Value2 = _this.app.MapStatistics.S;
                        break;
                    case "Y":
                        Value1 = _this.app.Hajjtatistics.Y;
                        Value2 = _this.app.MapStatistics.Y;
                        break;
                    case "L":
                        Value1 = _this.app.Hajjtatistics.L;
                        Value2 = _this.app.MapStatistics.L;
                        break;
                    case "Q":
                        Value1 = _this.app.Hajjtatistics.Q;
                        Value2 = _this.app.MapStatistics.Q;
                        break;

                    default:
                }
                _this.app.chart1.data.labels = [Label + " الغير محددة المكان", Label + "على الخريطة "];
                _this.app.chart1.data.datasets[0].data = [(Value1 - Value2), Value2];
                _this.app.chart1.update();
                $("#Chart1Title").text(" نسبة " + Label + "الغير محددة المكان")
            },
            ZoomToPark: function (parkCode) {
                var URL = _this.app.MapLayerURL + "/1";
                var QueryText = "Code ='" + parkCode + "'";
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
                });            },
            ZoonToMunicapility: function (ObjectID) {
                _this.app.mapView.graphics.removeAll();
                if (ObjectID == "") {

                    _this.app.ViewHome.go();
                    _this.app.MapHome.go();
                }
                var URL = _this.app.MapLayerURL + "/2";
                var QueryText = "OBJECTID  =" + ObjectID;
                _this.app.Support.ZoomToPolygon(URL, QueryText, 2);
            },
            ZoonToDistrict: function (ObjectID) {
                _this.app.mapView.graphics.removeAll();
                var URL = _this.app.MapLayerURL + "/3";
                var QueryText = "OBJECTID  =" + ObjectID;
                _this.app.Support.ZoomToPolygon(URL, QueryText, 2);
            },
            SearchHajj: function (QueryText) {
                //_this.app.map.layers.items[2].graphics.removeAll()
                //var Counter = null;
                //var HajjQueryTask = new QueryTask(_this.app.MapLayerURL + "/0");
                //var HajjQuery = new Query();
                //HajjQuery.returnGeometry = true;
                //HajjQuery.where = QueryText;
                //HajjQueryTask.execute(HajjQuery).then(function (featureSet) {
                //    var items = Array.map(featureSet.features, function (feature) {
                //        var sym = {
                //            type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                //            style: "square",
                //            color: "green",
                //            size: "12px",  // pixels
                //            outline: {  // autocasts as new SimpleLineSymbol()
                //                color: [255, 255, 0],
                //                width: 3  // points
                //            }
                //        };

                //        //    var infoTemp = new InfoTemplate("Vernal Pool Locations", "Latitude: ${Ycoord} <br/> Longitude: ${Xcoord} <br/> Plant Name:${Plant}");
                //        var gra = feature;
                //        gra.symbol = sym;
                //        _this.app.map.layers.items[2].add(gra);
                //    });

                //    ////-----------------------------------------------------------------------------


                //});
                _this.app.MapFeatureLayer.definitionExpression = QueryText;
                _this.app.MapFeatureLayer.queryFeatureCount().then(function (numFeatures) {
                    // prints the total count to the console
                    dom.byId("Resault").innerHTML = "نتيجة البحث : </br>" + numFeatures + "   موقع</br>" + " بنسبة " + Math.ceil(((numFeatures / _this.app.MapStatistics.All) * 100)) + " % </br> إجمالى المواقع على الخريطة : " + app.MapStatistics.All + " موقع " +
                        "</br>إجمالى المواقع :" + app.Hajjtatistics.All + "موقع";
                });

            }

        });
        return Hajj;
    });