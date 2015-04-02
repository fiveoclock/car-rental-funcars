angular.module('car', ['restangular', 'ngRoute', 'appStorage', 'uiGmapgoogle-maps']).
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
      when('/settings', {controller:AppStorageCtrl, templateUrl:'settings.html'}).
      when('/contact', {controller:ContactCtrl, templateUrl:'contact.html'}).
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


function AppStorageCtrl($scope, $location, appStorage, Restangular) {
    appStorage('MyAppStorage', 'myAppStorage', $scope);
    $scope.cars = Restangular.all("cars").getList().$object;
    
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

function AppStorageCtrl2($scope, appStorage) {
    appStorage('MyAppStorage', 'myAppStorage', $scope);
    $scope.myAppStorage.options = $scope.myAppStorage.options || [];
}  
  
function ListCtrl($scope, Restangular, appStorage) {
    appStorage('MyAppStorage', 'myAppStorage', $scope);
    console.log("selected currency: "+ $scope.myAppStorage.currency.id);
    
    // Normal GET function
    //$scope.cars = Restangular.all("cars").getList().$object;
    
    // Using POST to get converted price
    $scope.cars = Restangular.all('cars').post($scope.car, $scope.myAppStorage.currency.id,  {'Content-Type': 'text/plain'}).$object;
}


function CreateCtrl($scope, $location, Restangular, appStorage) {
  $scope.save = function() {
    Restangular.all('cars').post($scope.car).then(function(car) {
      $location.path('/');
    });
  }
}

function EditCtrl($scope, $location, Restangular, car, appStorage) {
    appStorage('MyAppStorage', 'myAppStorage', $scope);
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
  
  $scope.cancel = function() {
      $location.path('/list');
  };

  $scope.save = function() {
    var ret = $scope.car.put($scope.myAppStorage.username,  {'Content-Type': 'text/plain'}).then(function() {
        console.log("Booking successful");
        $location.path('/');
    }, function() {
        console.log("Booking unsuccessful");
    } );
    console.log(ret);
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
