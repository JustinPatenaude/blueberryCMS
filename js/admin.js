$(function() {

var userName = "";
var oauthToken = "";

$('.github_login').click(function(){
  window.open('https://github.com/login/oauth/authorize?client_id=e4a530296caca9a0979d');
});

window.addEventListener('message', function (event) {
	var code = event.data;
	$.get('http://blueberry.justinpatenaude.com/token.php?code=' + code, function (access_token) {
    oauthToken = access_token;
    console.log(access_token);
		$.getJSON('https://api.github.com/user?access_token=' + access_token, function (user) {
			userName = user.login;
      console.log(user.login);
		});
	});
});

var github = new Github({
  token: oauthToken,
  auth: "oauth"
});

var user = userName;

user.repos(function(err, repos) {
  repos.append('.admin');
});

/*var repo = github.getRepo(userName, 'jekyll');

repo.read('gh-pages', 'index.html', function(err, data) {
  $('.show_page').html(data);
});

$('.save_page').click(function(){
  var newContents = $('.show_page').val();
  repo.write('gh-pages', 'index.html', newContents, 'Updated from website', function(err) {});
});*/

});
