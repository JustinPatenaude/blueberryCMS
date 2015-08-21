var grayMatter = require('gray-matter');

$(function() {

var userName = 'JustinPatenaude'; //Cookies.get('username');
var accessToken = 'e4a41102c6b5270ae96bdf35c992980f0f3eec56'; //Cookies.get('access_token');
var repositoryName = Cookies.get('repository_name');
var github = new Github({
      token: accessToken,
      auth: "oauth"
    });
var repo = github.getRepo(userName, repositoryName);

/* onLoad
=================================*/

if ($('.github_login').is(':visible')) {
  findRepositories(accessToken);
}

if (window.location.href.indexOf("/edit_pages/") > -1) {
  findFiles();
}

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

$('.file_list').on('change', function(){
  var file = $(this).find('option:selected');
  showFile(file);
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
    github = new Github({
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
  repo = github.getRepo(userName, repositoryName);
}

function checkRepository(){
    console.log(repositoryName);
}

function findFiles(){
  repo.getTree('master', function(err, tree) {
    $.each(tree, function(key, value){
      if(value.path.indexOf('.md') > -1){
        repo.read('master', value.path, function(err, data) {
          data = grayMatter(data);
          var content = data.content;
          var optionAttributes = "";
          $.each(data.data, function(key, value){
            optionAttributes += 'data-'+key+'="'+value+'" ';
          });
          console.log(optionAttributes);
          console.log(data);
          $('.file_list').append('<option val="'+value.path+'" '+optionAttributes+' data-content="'+content+'">'+data.data.title+'</option>');
        });
      }
    });
  });
}

function showFile(file){
  var fileTitle = file.attr('data-title'),
      fileLayout = file.attr('data-layout'),
      filePermalink = file.attr('data-permalink'),
      fileContent = file.attr('data-content');
  $('#title').val(fileTitle);
  $('#layout').val(fileLayout);
  $('#permalink').val(filePermalink);
  $('.content').val(fileContent);
}

//gfjdhsbhsdgjhsf
/*var repo = github.getRepo(userName, 'jekyll');

repo.read('gh-pages', 'index.html', function(err, data) {
  $('.show_page').html(data);
});

$('.save_page').click(function(){
  var newContents = $('.show_page').val();
  repo.write('gh-pages', 'index.html', newContents, 'Updated from website', function(err) {});
});*/

});
