var app = angular.module('cubeFourms',['ui.router'])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider
		.state('home',{
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromise: ['posts', function(posts){
					return posts.getAll();
				}]
			}
		})
        .state('posts', {
            url: '/posts/:id',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function($stateParams, posts) {
                    return posts.get($stateParams.id);
                }]
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthCtrl',
			onEnter: ['$state','auth',function($state, auth){
            	if(auth.isLoggedIn()){
            		$state.go('home');
            	}
			}]
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: ['$state','auth',function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('home');
                }
            }]
        });
		$urlRouterProvider.otherwise('home');
	}
]);


app.factory('posts', [ '$http','auth',function($http,auth){
	//service body
	var o = {
		posts: [{title: 'post 1',upvotes: 5,comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 2},
					{author: 'Jane', body: 'Lame post!', upvotes: 0}
				]},
			{title: 'post 2',upvotes: 3,
						comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 2},
					{author: 'Jane', body: 'Lame post!', upvotes: 0}
				]},
			{title: 'post 3',upvotes: 14,				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 2},
					{author: 'Jane', body: 'Lame post!', upvotes: 0}
				]},
			{title: 'post 4',upvotes: 6,				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 2},
					{author: 'Jane', body: 'Lame post!', upvotes: 0}
				]},
			{title: 'post 5',upvotes: 20,				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 2},
					{author: 'Jane', body: 'Lame post!', upvotes: 0}
				]}]
	};
	o.getAll = function() {
		return $http.get('/posts').success(function(data){
			angular.copy(data, o.posts);
		});
	};
	//what does post do
	o.create = function (post) {
		return $http.post('/posts', post,{
            headers: {Authorization: 'Bearer ' + auth.getToken()}
			}).success(function(data){
			o.posts.push(data);
		});
	};
	o.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote',null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function(data){
            post.upvotes += 1;
        });
    };
    o.downvote = function (post) {
        return $http.put('/posts/' + post._id + '/downvote',null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function(data){
            post.upvotes -= 1;
        });
    };
	o.get = function (id) {
		return $http.get('/posts/' + id).then(function (res) {
			return res.data;
		});
	};
	o.addComment = function(id, comment){
		return $http.post('/posts/' + id + '/comments', {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
	};
    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote',null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function(data){
                comment.upvotes += 1;
		});
    };
	o.downvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote',null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function(data){
				comment.upvotes -= 1;
		});
	};
	return o;
}]);

//---------------
//--CONTROLLERS--
//---------------

//MAIN CONTROLLER
app.controller('MainCtrl', [
	'$scope',
	'posts',
	'auth',
	function($scope, posts,auth){
	  	$scope.test = 'Hello world';
        $scope.isLoggedIn = auth.isLoggedIn;
		$scope.posts = posts.posts;
		$scope.author = auth.currentUser();
        console.log(''+$scope.author);
		/*$scope.posts = [
			{title: 'post 1',upvotes: 5},
			{title: 'post 2',upvotes: 3},
			{title: 'post 3',upvotes: 14},
			{title: 'post 4',upvotes: 6},
			{title: 'post 5',upvotes: 20}
		]; */

		$scope.addPost = function(){
			//filter the post to now allow blank posts
			if(!$scope.title || $scope.title==''){return;} 
			posts.create({
				title: $scope.title,
				link: $scope.link,
				author: $scope.author
			});
			$scope.title = ''; //reset the title
			$scope.link = ''; //reset the link
			//$scope.comments.body = '';
		};

	
		$scope.incrementUpvotes = function(post){
			posts.upvote(post);
		};
        $scope.decrementUpvotes = function(post){
            posts.downvote(post);
        };
}]);

//POSTS CONTROLER
app.controller('PostsCtrl', [
	'$scope',
	'posts',
	'post',
	'auth',
	function($scope, posts, post,auth){
		$scope.post = post;
        $scope.isLoggedIn = auth.isLoggedIn;

		$scope.addComment = function(){
			if($scope.body === ''){ return; }
				posts.addComment(post._id,{
					body: $scope.body,
					author: auth.currentUser
				}).success(function(comment){
					$scope.post.comments.push(comment);
			});
			$scope.body = '';
		};

		$scope.incrementUpvotes = function(comment){
			posts.upvoteComment(post, comment);
		};
		$scope.decrementUpvotes = function(comment){
			posts.downvoteComment(post, comment);
		};
}]);

app.controller('AuthCtrl',[
	'$scope',
	'$state',
	'auth',
    //authorizes user and errors redirect to home
	function ($scope, $state, auth){
		$scope.user = {};
		$scope.register = function () {
			auth.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function () {
				$state.go('home');
            });
        };
		$scope.logIn = function(){
            auth.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function () {
                $state.go('home');
            });
		};
    }
]);

app.controller('NavControl',[
	'$scope',
	'auth',
	function($scope, auth){
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.currentUser = auth.currentUser;
		$scope.logOut = auth.logOut;
	}
]);

app.factory('auth',['$http','$window', function($http,$window){
	var auth = {};
    auth.saveToken = function (token){
        $window.localStorage['cube-fourm-token'] = token;
    };
    auth.getToken = function(){
        return $window.localStorage['cube-fourm-token'];
    };
    auth.isLoggedIn = function(){
        var token = auth.getToken();
        if(token){
            //TODO: look up payload and tokens
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        }else{
            return false;
        }
    };
    auth.currentUser = function(){
        if(auth.isLoggedIn()){
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.username;
        }
    };

    auth.register = function(user){
        return $http.post('/register',user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function(user) {
        return $http.post('/login',user).success(function(data){
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function(user) {
        $window.localStorage.removeItem('cube-fourm-token');
    };
	return auth;
}]);



