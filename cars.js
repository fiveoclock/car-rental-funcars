function Car($scope, $http) {
    $http.get('/api/myapp/cars').
        success(function(data) {
            $scope.cars = data;
        });
}
