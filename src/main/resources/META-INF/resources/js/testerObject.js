var test = {
    testInitializeVisualisation: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "01/01/2012";
        app.endDate = "29/04/2013";
        app.tieIds = [{id:2000,valid:true},{id:3000,valid:true},{id:5000,valid:true}];

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);

    },

    testDate: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "01/01/2012";
        app.endDate = "29/04/2013";
        app.difference = 30;
        app.tieIds = [{id:2000,valid:true},{id:3000,valid:true},{id:5000,valid:true}];

        //start watch cycle manaual
        app.$apply();

        setTimeout(function() {
            app.initializeVisualisation();
            app.$apply();
        },100);

}

}