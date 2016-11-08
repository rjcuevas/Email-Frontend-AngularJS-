angular.module( 'ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.module',
  'ngBoilerplate.email',
  'ui.router'
])

.constant('backend','https://rjback-dot-backend-dot-cs-development-playground.appspot.com')

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.run( function run () {
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $http, $window, backend) {
     /*$http.get(backend+"/api/user/auth").then(function(response) {
         var data = response.data;
         if(data['login_url'] !== undefined){
             $window.location.href = data['login_url'];
         } else {
             $scope.nickname = data['nickname'];
             $scope.user_email= data['user_email'];
          }
     });*/
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }

    });

    $scope.logout = function() {
        $http.get(backend+"/api/user/logout").then(function(response) {
            var data = response.data;
            $window.location.href = data['logout_url'];
        });
    };
});

