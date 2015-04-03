var app = angular.module('car', ['restangular', 'ngRoute', 'appStorage', 'ui.bootstrap', 'uiGmapgoogle-maps']);

app.config(function($routeProvider, RestangularProvider) {
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
      when('/settings', {controller:AppStorageCtrl, templateUrl:'settings.html'}).
      when('/contact', {controller:ContactCtrl, templateUrl:'contact.html'}).
      otherwise({redirectTo:'/'});
      
      RestangularProvider.setBaseUrl('/api/myapp/');
      //RestangularProvider.setDefaultRequestParams({ apiKey: '4f847ad3e4b08a2eed5f3b54' })
      RestangularProvider.setRestangularFields({
        id: 'id'
      });
  });


function AppStorageCtrl($scope, $location, appStorage, Restangular) {
    appStorage('MyAppStorage', 'myAppStorage', $scope);
    
    $scope.currencies = Restangular.all("currencies").getList().$object;
    
    $scope.close = function() {
      $location.path('/');
    };
    
    $scope.destroy = function() {
    original.remove().then(function() {
      $location.path('/');
    });
  };
}


function ListCtrl($scope, Restangular, appStorage) {
    appStorage('MyAppStorage', 'myAppStorage', $scope);
    console.log("Selected currency: "+ $scope.myAppStorage.currency.id);
    
    // Normal GET function
    //$scope.cars = Restangular.all("cars").getList().$object;
    
    // Using POST to get converted price
    //$scope.cars = Restangular.all('cars').post($scope.car, $scope.myAppStorage.currency.id,  {'Content-Type': 'text/plain'}).$object;
    
    // Sends a GET request like this: GET /api/cars?curr=$currency.id
    $scope.cars = Restangular.all("cars").getList({curr: $scope.myAppStorage.currency.id}).$object;
    
}


function CreateCtrl($scope, $location, Restangular, appStorage) {
  $scope.save = function() {
    Restangular.all('cars').post($scope.car).then(function(car) {
      $location.path('/');
    });
  }
}

function EditCtrl($scope, $location, Restangular, car, appStorage, $modal) {
  appStorage('MyAppStorage', 'myAppStorage', $scope);
  var original = car;
  $scope.car = Restangular.copy(original);
  //$scope.cars = Restangular.one("car").get({curr: $scope.myAppStorage.currency.id}).$object;
  
  $scope.isClean = function() {
    return angular.equals(original, $scope.car);
  }

  $scope.destroy = function() {
    original.remove().then(function() {
      $location.path('/list');
    });
  };
  
  $scope.cancel = function() {
      $location.path('/list');
  };

  $scope.save = function() {
    var ret = $scope.car.put($scope.myAppStorage.username,  {'Content-Type': 'text/plain'}).then(function(response) {
        console.log("Booking successful: " + response.msg);
        
        $location.path('/');
        $scope.message = response.msg;
        
        $scope.data = {
            title : "Booking successful",
            message : response.msg,
            mode : 'info'
        }
        
        $scope.showModal();
    }, function() {
        console.log("Booking unsuccessful");
        
        $scope.message = response.msg;
        
        $scope.data = {
            title : "Booking unsuccessful",
            message : "Please try again later. " + response.msg,
            mode : 'info'
        }
        
        $scope.showModal();
    } );
  };
  
  
  $scope.showModal = function(size) {
    var modalInstance = $modal.open({
      templateUrl: 'modal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        data: function () {
          return $scope.data;
        }
      }
    });


  };
  
}

function ContactCtrl($scope, $location) {
    // for the map
    $scope.map = {
        center: { latitude: 47.81351, longitude: 15.0 },
        draggable: true,
        zoom: 8
    };

    // map options
    $scope.options = {
        scrollwheel: true
    };

    // map marker
    $scope.marker_vie = {
        id: 0,
        coords: { latitude:  48.2070736, longitude: 16.37979340000004 },
        options: {
            draggable: false,
            title: 'Vienna',
            animation: 1 // 1: BOUNCE, 2: DROP
        }
    };
    $scope.marker_sp = {
        id: 1,
        coords: { latitude:  47.2278816, longitude: 14.75984010000002 },
        options: {
            draggable: false,
            title: 'Spielberg',
            animation: 1 // 1: BOUNCE, 2: DROP
        }
    };
    
    $scope.center_vie = function() {
        $scope.map = { center: { latitude:  48.2070736, longitude: 16.37979340000004}, zoom: 15 }
    };
    
    $scope.center_sp = function() {
        $scope.map = { center: { latitude:  47.2278816, longitude: 14.75984010000002}, zoom: 15 };
    };
}





// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('car').controller('ModalInstanceCtrl', function ($scope, $modalInstance, data) {
  $scope.data = data;
 
  $scope.ok = function () {
      $modalInstance.dismiss('cancel');
  };

});