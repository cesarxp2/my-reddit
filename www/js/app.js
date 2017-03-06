(function() {
  var app = angular.module('myreddit', ['ionic', 'angularMoment'])

  app.controller('RedditCtrl', function($scope, $http) {

    $scope.stories = [];

    // One global story loader
    function loadStories(params, callback) {
      $http.get('https://www.reddit.com/r/Android/new/.json', {params}).success(function(response) {
        var stories = [];
        angular.forEach(response.data.children, function(child) {
          var story = child.data;
          if (!story.thumbnail || story.thumbnail === 'self') {
            story.thumbnail = 'https://cdn2.iconfinder.com/data/icons/social-icons-color/512/reddit-128.png';
          }
          stories.push(child.data)
        });
        callback(stories);
      });

    }

    // Loads older stories
    $scope.loadOlderStories = function() {
      var params = {};
      if ($scope.stories.length > 0) {
        params['after'] = $scope.stories[$scope.stories.length - 1].name;
      }
      loadStories(params, function(olderStories) {
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    // Loads newer stories
    $scope.loadNewerStories = function() {
      var params = {
        'before': $scope.stories[0].name
      };
      loadStories(params, function(newerStories) {
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.openLink = function(url) {
      window.open(url, 'blank');
    };
  });

  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {

        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.cordova && window.cordova.InAppBrowser) {
        window.open = window.cordova.InAppBrowser.open;
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
}());
