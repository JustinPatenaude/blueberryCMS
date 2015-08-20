$(function() {

var userName = "";
var oauthToken = "";

$('.github_login').click(function(){
  window.open('https://github.com/login/oauth/authorize?client_id=e4a530296caca9a0979d');
});

window.addEventListener('message', function (event) {
	var code = event.data;
	$.get('token.php?code=' + code, function (access_token) {
    oauthToken = access_token;
    Cookies.set('access_token', access_token);
		$.getJSON('https://api.github.com/user?access_token=' + access_token, function (user) {
			userName = user.login;
      Cookies.set('username', userName);
		});
	});
});

var access_token = Cookies.set('access_token');

findRepositories();

function findRepositories(){
  if(access_token != undefined){
    $('.github_login').hide();
    $('.github_logout').css('display', 'inline-block');
    var github = new Github({
      token: access_token,
      auth: "oauth"
    });
    var user = github.getUser();
    user.repos(function(err, repos) {
      $.each(repos, function(key, value){
        $('.repository_list').append('<div class="repository_name" data-name="'+value['name']+'">'+value['name']+'</div>')
      });
    });
  }
}

$('.github_logout').click(function(){
  githubLogout();
});

function githubLogout(){
  Cookies.remove('username');
  Cookies.remove('access_token');
  location.reload();
};


/*var repo = github.getRepo(userName, 'jekyll');

repo.read('gh-pages', 'index.html', function(err, data) {
  $('.show_page').html(data);
});

$('.save_page').click(function(){
  var newContents = $('.show_page').val();
  repo.write('gh-pages', 'index.html', newContents, 'Updated from website', function(err) {});
});*/

});
