WMTSLayers = {
    //NORMALE PIXELKARTE
    wmts_layer1: {
        wmts_layer_options: {
            name: 'Pixelkarte',
            layer: 'ch.swisstopo.pixelkarte-farbe',
            layername: 'ch.swisstopo.pixelkarte-farbe',
            version: "1.0.0",
            requestEncoding: "REST",
            url: ['http://wmts5.geo.admin.ch/',
                'http://wmts6.geo.admin.ch/',
                'http://wmts7.geo.admin.ch/',
                'http://wmts8.geo.admin.ch/',
                'http://wmts9.geo.admin.ch/'
            ],
            style: "default",
            matrixSet: "21781",
            formatSuffix: 'jpeg',
            dimensions: ['TIME'],
            params: {
                'time': 20111206 // You need this, 'default' won't work
            },
            projection: new OpenLayers.Projection('EPSG:21781'),
            units: 'm',
            format: 'image/jpeg',
            buffer: 0,
            opacity: 1.0,
            displayInLayerSwitcher: false,
            isBaseLayer: true,
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            tileOrigin: OpenLayers.LonLat(420000, 350000),
            resolutions: [500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
            serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        },

        name: 'Pixelkarte',
        description: 'Pixelkarte',
        img_url: 'img\/pixelkarte.PNG',
        visible: true,
        restrictedExtent: new OpenLayers.Bounds(480000, 68940, 837000, 298940)
    },


    //NOSCALE
    wmts_layer2: {
        wmts_layer_options: {
            name: 'Pixelkarte-noscale',
            layer: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
            layername: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
            version: "1.0.0",
            requestEncoding: "REST",
            url: ['http://wmts5.geo.admin.ch/',
                'http://wmts6.geo.admin.ch/',
                'http://wmts7.geo.admin.ch/',
                'http://wmts8.geo.admin.ch/',
                'http://wmts9.geo.admin.ch/'
            ],
            style: "default",
            matrixSet: "21781",
            formatSuffix: 'jpeg',
            dimensions: ['TIME'],
            params: {
                'time': 20140106 // You need this, 'default' won't work
            },
            projection: new OpenLayers.Projection('EPSG:21781'),
            units: 'm',
            format: 'image/jpeg',
            buffer: 0,
            opacity: 1.0,
            displayInLayerSwitcher: false,
            isBaseLayer: true,
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            tileOrigin: OpenLayers.LonLat(420000, 350000),
            resolutions: [500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
            serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        },

        name: 'Pixelkarte',
        description: 'Pixelkarte',
        img_url: 'img\/pixelkarte_noscale.PNG',
        visible: false,
        restrictedExtent: new OpenLayers.Bounds(420230, 68940, 930830, 298940)
    },

    //SWISSIMAGE
    wmts_layer3: {
        wmts_layer_options: {
            name: 'Swissimage',
            layer: 'ch.swisstopo.swissimage',
            layername: 'ch.swisstopo.swissimage',
            version: "1.0.0",
            requestEncoding: "REST",
            url: ['http://wmts5.geo.admin.ch/',
                'http://wmts6.geo.admin.ch/',
                'http://wmts7.geo.admin.ch/',
                'http://wmts8.geo.admin.ch/',
                'http://wmts9.geo.admin.ch/'
            ],
            style: "default",
            matrixSet: "21781",
            formatSuffix: 'jpeg',
            dimensions: ['TIME'],
            params: {
                'time': 20151231 // You need this, 'default' won't work
            },
            projection: new OpenLayers.Projection('EPSG:21781'),
            units: 'm',
            format: 'image/jpeg',
            buffer: 0,
            opacity: 1.0,
            displayInLayerSwitcher: false,
            isBaseLayer: true,
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            tileOrigin: OpenLayers.LonLat(420000, 350000),
            resolutions: [500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
            serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        },

        name: 'Pixelkarte',
        description: 'Pixelkarte',
        img_url: 'img\/swissimage.PNG',
        visible: true,
        restrictedExtent: new OpenLayers.Bounds(420230, 68940, 930830, 298940)
    },

    //SWISSIMAGE-PRODUCT
    wmts_layer4: {
        wmts_layer_options: {
            name: 'Swissimage-product',
            layer: 'ch.swisstopo.swissimage-product',
            layername: 'ch.swisstopo.swissimage-product',
            version: "1.0.0",
            requestEncoding: "REST",
            url: ['http://wmts5.geo.admin.ch/',
                'http://wmts6.geo.admin.ch/',
                'http://wmts7.geo.admin.ch/',
                'http://wmts8.geo.admin.ch/',
                'http://wmts9.geo.admin.ch/'
            ],
            style: "default",
            matrixSet: "21781",
            formatSuffix: 'jpeg',
            dimensions: ['TIME'],
            params: {
                'time': 20151231 // You need this, 'default' won't work
            },
            projection: new OpenLayers.Projection('EPSG:21781'),
            units: 'm',
            format: 'image/jpeg',
            buffer: 0,
            opacity: 1.0,
            displayInLayerSwitcher: false,
            isBaseLayer: true,
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            tileOrigin: OpenLayers.LonLat(420000, 350000),
            resolutions: [500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
            serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        },

        name: 'Pixelkarte',
        description: 'Pixelkarte',
        img_url: 'img\/swissimage-product.PNG',
        visible: true,
        restrictedExtent: new OpenLayers.Bounds(420230, 68940, 930830, 298940)
    },

    wmts_layer5: {
        wmts_layer_options: {
            name: 'Swisslm3d',
            layer: 'ch.swisstopo.swisstlm3d-karte-farbe',
            layername: 'ch.swisstopo.swisstlm3d-karte-farbe',
            version: "1.0.0",
            requestEncoding: "REST",
            url: ['http://wmts5.geo.admin.ch/',
                'http://wmts6.geo.admin.ch/',
                'http://wmts7.geo.admin.ch/',
                'http://wmts8.geo.admin.ch/',
                'http://wmts9.geo.admin.ch/'
            ],
            style: "default",
            matrixSet: "21781",
            formatSuffix: 'png',
            dimensions: ['TIME'],
            params: {
                'time': 20150401 // You need this, 'default' won't work
            },
            projection: new OpenLayers.Projection('EPSG:21781'),
            units: 'm',
            format: 'image/png',
            buffer: 0,
            opacity: 1.0,
            displayInLayerSwitcher: false,
            isBaseLayer: true,
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            tileOrigin: OpenLayers.LonLat(420000, 350000),
            resolutions: [500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
            serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        },

        name: 'Pixelkarte',
        description: 'Pixelkarte',
        img_url: 'img\/swisslm3d.PNG',
        visible: true,
        restrictedExtent: new OpenLayers.Bounds(420230, 68940, 930830, 298940)
    }

};