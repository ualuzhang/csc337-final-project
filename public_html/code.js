/*
  Author: Zhenyu Yuan
  Class: CSc337
  get from login.zip, changed url and added a localStorage object to
  store username.
*/
/*
  function login helps for login to the home page.
  It gaves some error msg if error.
*/
function login() {
  var httpRequest = new XMLHttpRequest();
  
  let u = document.getElementById('lusername').value;
  let p = document.getElementById('lpassword').value;

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        if (httpRequest.responseText == 'BAD') {
        } else {
          let url = '/main.html';
          localStorage.setItem('user', u);
          window.location = url;
        }
        document.getElementById('warningOutput').innerHTML 
        = "Issue logging with that info";      
      } else { alert('ERROR'); }
    }
  }

  httpRequest.open('GET', '/login/' + u + '/' + p, true);
  httpRequest.send();
}


/*
  function areatAccount is able to help create a new account, 
  It alert an error if a username is already used.
*/
function createAccount() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        alert(httpRequest.responseText);
      } else { alert('ERROR'); }
    }
  }

  let u = document.getElementById('username').value;
  let p = document.getElementById('password').value;

  httpRequest.open('GET', '/create/' + u + '/' + p, true);
  httpRequest.send();
}
function createGroup(){
  window.location = '/createGroup.html';
}
