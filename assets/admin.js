$(function() {

var userName = Cookies.get('username');
var accessToken = Cookies.get('access_token');
var repositoryName = Cookies.get('repository_name');

/* onLoad
=================================*/
findRepositories(accessToken);

/* Events
=================================*/
$('.github_login').click(function(){
  window.open('https://github.com/login/oauth/authorize?client_id=e4a530296caca9a0979d');
});

$('.github_logout').click(function(){
  githubLogout();
});

$(document).on('click', '.repository_name', function(){
  var repository = $(this);
  console.log('test');
  saveRepository(repository);
});

window.addEventListener('message', function (event) {
	var code = event.data;
	$.get('token.php?code=' + code, function (accessTokenPHP) {
    Cookies.set('access_token', accessTokenPHP);
    accessToken = Cookies.get('access_token');
		$.getJSON('https://api.github.com/user?access_token=' + accessTokenPHP, function (user) {
			userName = user.login;
      Cookies.set('username', userName);
		});
    findRepositories(accessToken);
	});
});


/* Functions
=================================*/
function githubLogout(){
  Cookies.remove('username');
  Cookies.remove('access_token');
  location.reload();
};

function findRepositories(){
  if(accessToken != undefined){
    $('.github_login').hide();
    $('.github_logout').css('display', 'inline-block');
    var github = new Github({
      token: accessToken,
      auth: "oauth"
    });
    var user = github.getUser();
    user.repos(function(err, repos) {
      $.each(repos, function(key, value){
        if(value['name'] == repositoryName){
          $('.repository_list').append('<div class="repository_name selected" data-name="'+value['name']+'">'+value['name']+'</div>');
        }
        else {
          $('.repository_list').append('<div class="repository_name" data-name="'+value['name']+'">'+value['name']+'</div>');
        }
      });
    });
    repositoriesAreLoaded();
  }
}

function repositoriesAreLoaded(){
  checkRepository();
}

function saveRepository(repository){
  $('.repository_name.selected').removeClass('selected');
  console.log(repository);
  repository.addClass('selected');
  repositoryName = repository.attr('data-name');
  Cookies.set('repository_name', repositoryName);
}

function checkRepository(){
    console.log(repositoryName);
}


/*var repo = github.getRepo(userName, 'jekyll');

repo.read('gh-pages', 'index.html', function(err, data) {
  $('.show_page').html(data);
});

$('.save_page').click(function(){
  var newContents = $('.show_page').val();
  repo.write('gh-pages', 'index.html', newContents, 'Updated from website', function(err) {});
});*/

});
