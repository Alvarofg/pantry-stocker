var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config')
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/additems', {
      templateUrl: '/views/templates/additems.html',
      controller: 'AddItemController as aic',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/usersetup', {
      templateUrl: '/views/templates/usersetup.html',
      controller: 'UserSetupController as usc',
      resolve: {
        getuser: function(UserService) {
          return UserService.getuser()
        }
      }
    })
    .when('/mypantries', {
      templateUrl: '/views/templates/pantryview.html',
      controller: 'UserSetupController as usc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser()
        }
      }
    })

    .otherwise({
      redirectTo: 'home'
    });
});
