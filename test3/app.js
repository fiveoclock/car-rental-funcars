angular.module('car', ['restangular', 'ngRoute']).
  config(function($routeProvider, RestangularProvider) {
    $routeProvider.
      when('/', {
        controller:ListCtrl, 
        templateUrl:'list.html'
      }).
      when('/book/:carId', {
        controller:EditCtrl, 
        templateUrl:'book.html',
        resolve: {
          car: function(Restangular, $route){
              console.log($route.current.params.carId);
            return Restangular.one('cars', $route.current.params.carId).get();
          }
        }
      }).
      when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
      otherwise({redirectTo:'/'});
      
      RestangularProvider.setBaseUrl('/api/myapp/');
      //RestangularProvider.setDefaultRequestParams({ apiKey: '4f847ad3e4b08a2eed5f3b54' })
      RestangularProvider.setRestangularFields({
        id: 'id'
      });
      
      RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
        
        if (operation === 'put') {
          elem._id = undefined;
          return elem;
        }
        return elem;
      })
  });


function ListCtrl($scope, Restangular) {
   $scope.cars = Restangular.all("cars").getList().$object;
}


function CreateCtrl($scope, $location, Restangular) {
  $scope.save = function() {
    Restangular.all('cars').post($scope.car).then(function(car) {
      $location.path('/');
    });
  }
}

function EditCtrl($scope, $location, Restangular, car) {
  var original = car;
  $scope.car = Restangular.copy(original);
  

  $scope.isClean = function() {
    return angular.equals(original, $scope.car);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      $location.path('/list');
    });
  };

  $scope.save = function() {
    $scope.car.post().then(function() {
      $location.path('/');
    });
  };
}
