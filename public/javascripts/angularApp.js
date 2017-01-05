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
        });

		$urlRouterProvider.otherwise('home');
	}
]);


app.factory('posts', [ '$http',function($http){
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
		return $http.post('/posts', post).success(function(data){
			o.posts.push(data);
		});
	};
	o.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote').success(function(data){
            post.upvotes += 1;
        });
    };
    o.downvote = function (post) {

        return $http.put('/posts/' + post._id + '/downvote').success(function(data){
            post.upvotes -= 1;
        });
    };
	o.get = function (id) {
		return $http.get('/posts/' + id).then(function (res) {
			return res.data;
		});
	};
	o.addComment = function(id, comment){
		return $http.post('/posts/' + id + '/comments', comment);
	};
    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
            .success(function(data){
                comment.upvotes += 1;
            });
    };
	o.downvoteComment = function(post, comment) {
		return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote')
			.success(function(data){
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
	function($scope, posts){
	  	$scope.test = 'Hello world';
		$scope.posts = posts.posts;
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
				link: $scope.link
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
	function($scope, posts, post){
		$scope.post = post;


		$scope.addComment = function(){
			if($scope.body === ''){ return; }
				posts.addComment(post._id,{
					body: $scope.body,
					author: 'user'
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

