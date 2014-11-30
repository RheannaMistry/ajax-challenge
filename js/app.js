"use strict";

var commentsUrl = 'https://api.parse.com/1/classes/comment';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'jKT4L4HJUyRpgH0KJieDBR7K2F1ByOaK80rgguvs';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '7ouK3CJi9kTUCwKQJFoq7AqaOQ6CrK35nLQ6nRNf';
    })

    .controller('CommentController', function($scope, $http) {
        $scope.refreshComments = function() {
            $http.get(commentsUrl + '?order=-score')
                .success(function (data) {
                    $scope.comments = data.results;
                });
        };
        $scope.refreshComments();

    $scope.newComment = {score: 0};

    $scope.addComment = function() {
        if (document.getElementById("comment-title").value == "" ||
            document.getElementById("comment-name").value == "" ||
            document.getElementById("comment-body").value == "") {
            alert("Your must give your comment a title, name, and body!")
        } else {
            $scope.inserting = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {score: 0};
                    console.log($scope.comments);
                })
                .finally(function () {
                    $scope.inserting = false;
                });
        }
    };

    $scope.updateComment = function(comment) {
        $http.put(commentsUrl + '/' + comment.objectId, comment)
            .success(function () {
            });
    };

    $scope.deleteComment = function(comment) {
        $scope.inserting = true;
        $http.delete(commentsUrl + '/' +comment.objectId)
            .success(function() {
            })
            .finally(function() {
                $scope.refreshComments();
                alert('Comment is deleted');
                $scope.inserting = false;
            });
    };

    $scope.incrementScore = function(comment, amount) {
        if((comment.score <= 0 && amount < 0)) {
            alert('Score cannot be negative')
        } else {
            var postData = {
                score: {
                    __op: "Increment",
                    amount: amount
                }
            };
            $http.put(commentsUrl + '/' + comment.objectId, postData)
                .success(function (respData) {
                    comment.score = respData.score;
                })
                .error(function (err) {
                    console.log(err);
                });
        }
    };
});