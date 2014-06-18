require.config({
    paths: {
      "jquery"     : "/bower/jquery/dist/jquery",
      "jquery-ui"  : "/bower/jqueryui/ui/jquery-ui",
      "leaflet"    : "/bower/leaflet/dist/leaflet"
    },
    use: {leaflet: { attach: 'L'}}
});

require(['jquery', 'leaflet', 'jquery-ui'], function ($, L) {
    var map, osm;
    map = L.map('map', {});
    /*osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {minZoom:8, maxZoom:18, attribution: "OSM"});
    map.addLayer(osm);*/
    $('#address').autocomplete({
        source: function (request, response) {
            //console.log("source:%o", $('#address').val());
            $.ajax({
                url      : "http://dawa.aws.dk/adresser",
                dataType : "jsonp",
                data     : {
                    q : $('#address').val() + "*",
                    format : "geojson",
                    per_side: 5
                },
                success: function ( data) {
                    response ( $.map (data.features, function (item) {
                        return {
                            geometry : item.geometry,
                            label    : item.properties.vejnavn + " " + item.properties.husnr + "," + item.properties.kommunenavn,
                            value    : item.properties.vejnavn + " " + item.properties.husnr + "," + item.properties.kommunenavn,
                            id       : item.properties.id,
                            proprties: item.properties
                        }}));
                    }
                });
        },
        minLength: 2,
        select: function (event, ui ) {
            var coord = ui.item.geometry.coordinates;
            var marker = L.marker([coord[1], coord[0]]).addTo(map);
            map.setView(L.latLng(coord[1], coord[0]), 15);
        },
        open: function () {
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function () {
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });
    var skaermkort = L.tileLayer.wms("http://kortforsyningen.kms.dk/service?servicename=topo_skaermkort", {
        layers        : 'dtk_skaermkort_daempet',
        attribution   : "geodatastyrelsen" ,
        ticket        : kfTicket
    }).addTo(map);

    var orto = L.tileLayer.wms("http://kortforsyningen.kms.dk/service?servicename=orto_foraar", {
        layers        : 'orto_foraar',
        attribution   : "geodatastyrelsen" ,
        ticket        : kfTicket
    });

    var postdistrikt = L.tileLayer.wms("http://kortforsyningen.kms.dk/service?SERVICENAME=dagi", {
        servic        : 'WMS',
        LAYERS        : 'postdistrikt',
        attribution   : "Geodatastyrelsen" ,
        format       :  'image/png',
        ticket        : kfTicket,
        transparent   : true
    });

    var matrikel = L.tileLayer.wms("http://kortforsyningen.kms.dk/service?SERVICENAME=mat", {
        servic        : 'WMS',
        LAYERS        : 'MatrikelSkel',
        styles        : 'roede_skel',
        attribution   : "Geodatastyrelsen" ,
        format       :  'image/png',
        ticket        : kfTicket,
        transparent   : true
    });

    var baseLayers = {
        "skærmkort": skaermkort,
        "orto": orto
    }

    var overLayers = {
        "postdistrikt": postdistrikt,
        "matrikel": matrikel
    }

    L.control.layers(baseLayers, overLayers).addTo(map);
    navigator.geolocation.getCurrentPosition( function (pos) {
       map.setView(L.latLng(pos.coords.latitude, pos.coords.longitude), 15);
    });
});
