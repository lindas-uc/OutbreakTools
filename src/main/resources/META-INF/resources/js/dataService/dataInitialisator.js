var dataInitialisator;
dataInitialisator = {
    
    initializeData: function($scope) {
        console.log($scope.startDate);
        
        javaConnector.startJavaApplication($scope, function(data) {
            console.log(data);
        });
        
        
    }
    
};
