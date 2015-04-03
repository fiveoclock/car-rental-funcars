angular.module('appStorage', []).factory('appStorage',
    [ '$window', function($window) {
      var appStorages = {};
      var api = undefined;

      if ($window.localStorage) {
        api = {
          set : function(name, value) {
            $window.localStorage.setItem(name, JSON.stringify(value));
          },
          get : function(name) {
            var str = $window.localStorage.getItem(name);
            var val = {};
            try {
              val = str ? JSON.parse(str) : {};
            }
            catch (e) {
              console.log('Parse error for localStorage ' + name);
            }
            return val;
          },
          clear : function() {
            $window.localStorage.clear();
          }
        };
      }
      // possibly support other

      if (!api) {
        throw new Error('Could not find suitable storage');
      }

      return function(appName, property, scope) {
        if (appName === undefined) {
          throw new Error('appName is required');
        }

        var appStorage = appStorages[appName];

        var update = function() {
          api.set(appName, appStorage);
        };

        var clear = function() {
          api.clear(appName);
        };

        if (!appStorage) {
          appStorage = api.get(appName);
          appStorages[appName] = appStorage;
          update();
        }

        var bind = function(property, scope) {
          scope[property] = appStorage;
          scope.$watch(property, function() {
            update();
          }, true);
        };

        if (property !== undefined && scope !== undefined) {
          bind(property, scope);
        }

        return {
          get : function(name) {
            return appStorage[name];
          },
          set : function(name, value) {
            appStorage[name] = value;
            update();
          },
          clear : clear
        };
      };
    } ]);


var demo = angular.module('demo', [ 'appStorage' ]);

demo.controller('AppStorageController', [ '$scope', 'appStorage',
    function($scope, appStorage) {
      appStorage('MyAppStorage', 'myAppStorage', $scope);
    } ]);

demo.controller('OtherController', [ '$scope', 'appStorage',
    function($scope, appStorage) {
      appStorage('MyAppStorage', 'myAppStorage', $scope);
      $scope.myAppStorage.options = $scope.myAppStorage.options || [];
    } ]);
