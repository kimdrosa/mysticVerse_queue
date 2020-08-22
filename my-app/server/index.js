var express = require('express');
var WebSocket = require('ws')
var app = express();
var server = new WebSocket.Server({server : app.listen(3333)});



app.use(express.static('public'));

console.log('socket server is running on port 3333');

const users = [];
const maxTime =  60000;
const userList = [];
const activeUserList = [];
const activeUsers = [{videoUrl : 'placeholder1',
                          user : null,
                          connection : null,
                          time : null},
                        {videoUrl : 'placeholder2',
                         user : null,
                         connection : null,
                         time : null},
                        {videoUrl : 'placeholder3',
                         user : null,
                         connection : null,
                         time : null}];


server.on('connection', (socket) => {
    
    socket.on('message', message => {
      users.push({
                  user: message,
                  connection : socket
                })
      userList.push(message);
    });
    setInterval(() => {  
        console.log(userList);
                for(var i = 0; i < activeUsers.length; i++) {
                    if(activeUsers[i].user === null) {
                        if(users.length > 0) {
                        activeUsers[i].user = users[0].user;
                        activeUserList.push(userList[0]);
                        activeUsers[i].connection = users[0].connection;
                        users.shift();
                        userList.shift();
                        activeUsers[i].time = new Date();
                        activeUsers[i].connection.send("You can now enter the 3D verse!", activeUsers[i].videoUrl);
                        }
                    } else if (checkTimeOut(activeUsers[i])) {
                        activeUsers[i].user = null;
                        activeUserList.shift();
                        activeUsers[i].connection.send("Times Up!")
                    }
                }
            
                socket.send(JSON.stringify(userList));
                socket.send(JSON.stringify(activeUserList));
                
            }, 1000)

            function checkTimeOut (user) {
                        const currentTime = new Date()
                        if(currentTime - user.time >= maxTime) {
                            return true;
                        } else {
                            return false;
                        }}
  });



