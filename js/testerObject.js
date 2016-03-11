var test = {
    testInitializeVisualisation: function() {
        var element = $("#lindasMainContainer");
        var app = angular.element(element).scope();
        app.startDate = "29/03/2016";
        app.endDate = "29/04/2016";
        app.tieIds = [2,3,4];

        app.initializeVisualisation();

}
}