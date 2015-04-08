var demoApp = angular.module('demoApp', []);

demoApp.controller('List', function($scope, $http) {
	$scope.lists = []
	$scope.page = 1
	$scope.load = function() {
		$http.get('./getList/' + $scope.page)
			.success(function(data) {
				$scope.lists = $scope.lists.concat(data.Lists);
				$scope.page = data.Page;
			});
	}
})
demoApp.directive("listItem", function() {
	return {
		scope: {
			lists: '=info'
		},
		restrict: "AE",
		template: "<tbody ng-repeat='item in lists'><tr><td ng-bind='item.company'></td><td ng-bind='item.period'></td><td ng-bind='item.scale'></td><td ng-bind='item.salary'></td><td ng-bind='item.exp'></td><td ng-bind='item.allure'></td><td><a href='ng-bind='item.src''>查看</a></td></tr></tbody>",
		link: function(scope) {
			console.log('testlink')
		}
	};
})
demoApp.filter('to_trusted', ['$sce',
		function($sce) {
			console.log('!!!')
			return function(text) {
				return $sce.trustAsHtml(text);
			}
		}]
	)