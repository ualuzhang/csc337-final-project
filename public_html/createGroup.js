

function getUsers () {
    $.ajax({
        url: '/get/users/',
        method: 'GET',
        success: function (result){
            var obj = JSON.parse(result);
            var out = '';
            for(i in obj){
                var name = obj[i]['username'];
                out = out + '<p>' + name + '</p>';
            }
            $('#users').html(out);
        }
    });
}
getUsers();

function createGroup(){
    var users = document.getElementById('groupusers').value;
    var name = document.getElementById('name').value;
    console.log('------------');
    console.log(users);
    $.ajax({
        url: '/createGroup/' + users + '/' + name,
        method: 'GET',
        success: function(result) {
            alert(result);
        }
    });
}