angular.module( 'ngBoilerplate.module', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'module', {
    url: '/module',
    views: {
      "main": {
        controller: 'ModuleCtrl',
        templateUrl: 'module/module.tpl.html'
      }
    },
    data:{ pageTitle: 'Module' }
  });
})

.controller( 'ModuleCtrl', function ModuleCtrl( $scope, $http ) {
  $scope.dropdownItems = [
    "The quick brown fox jump over the lazy dog.",
    "The quick brown dog jump over the lazy fox.",
    "The quick brown fox lazy over the jump dog."
  ];

  $scope.selectItem = function(item) {
    $scope.selectedItem = " : " + item;
  };

  $scope.viewList = function() {
    $http.get("https://rjapi-dot-backend-dot-cs-development-playground.appspot.com/api/emails/list").then(function(response) {
        $scope.emailArray = response.data.data;
      console.log($scope.emailArray);
    });

  };

})

;
