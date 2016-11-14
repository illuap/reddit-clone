var app = angular.module('cubeFourms',['ui.router'])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider
		.state('home',{
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		})
		.state('posts',{
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});

		$urlRouterProvider.otherwise('home');
	}
]);

app.factory('posts', [function(){
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
	  	$scope.test = "Hello world";
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
			$scope.posts.push({
				title: $scope.title,
				link: $scope.link,
				upvotes: 0,
				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 2},
					{author: 'Jane', body: 'Lame post!', upvotes: 0}
				]
			});
			$scope.title = ""; //reset the title
			$scope.link = ""; //reset the link 
			//$scope.comments.body = "";
		};
		

	
		$scope.incrementUpvote = function(post){
			post.upvotes += 1;
		}
}]);

//POSTS CONTROLER
app.controller('PostsCtrl', [
	'$scope',
	'$stateParams',
	'posts',
	function($scope, $stateParams, posts){
		$scope.post = posts.posts[$stateParams.id];

		$scope.addComment = function(){
			if(scope.body == ''){return;}
			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 0
			});
			$scope.body = '';
		};
}]);