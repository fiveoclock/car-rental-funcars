function Hello($scope, $http) {
    $http.get('/api/myapp/cars/1').
        success(function(data) {
            $scope.greeting = data;
        });
}
