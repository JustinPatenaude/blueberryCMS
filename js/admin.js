$(function() {

var userName = "JustinPatenaude";

$('.github_login').click(function(){
  window.open('https://github.com/login/oauth/authorize?client_id=e4a530296caca9a0979d&state=fhf74hfgdje8hfgfjhdg4627');
});

var github = new Github({
  username: "JUSTINPATENAUDE",
  password: "",
  auth: "basic"
});

var repo = github.getRepo(userName, 'jekyll');

repo.read('gh-pages', 'index.html', function(err, data) {
  $('.show_page').html(data);
});

$('.save_page').click(function(){
  var newContents = $('.show_page').val();
  repo.write('gh-pages', 'index.html', newContents, 'Updated from website', function(err) {});
});

$()

});
