const http = require("http"),
    fs = require("fs");
const port = 3456;
const file = "client.html";
const server = http.createServer(function (req, res) {
    fs.readFile(file, function (err, data) {
        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });
});
server.listen(port);
const socketio = require("socket.io")(server);
const io = socketio.listen(server);
// creative feature. if the filter is activated, if a user inputs these words they will not be displayed on the screen for all users.
var politics_filter = ["Republican", "republican", "Republicans", "republicans", "Democrats", "democrats", "Donald Trump", "donald trump", "trump", "Trump", "Joe Biden", "joe biden", "biden", "election", "elections", "president", "President", "Obama", "Barack Obama", "barack obama", "MAGA", "make america great again", "MAKE AMERICA GREAT AGAIN", "hilary clinton", "Hilary Clinton", "Bill Clinton", "bill clinton", "Clinton", "clinton"];
var religion_filter = ["Muslims", "muslims", "muslim", "Islam", "islam", "Jews", "Jew", "jews", "jew", "Christians", "christians", "christian", "Christian", "Hindus", "hindu", "Hindu", "hindus", "Hinduism", "Christianity", "hinduism", "christianity", "Judaism", "judaism", "Christmas", "christmas", "Eid", "eid", "Ramadan", "ramadan", "Hannukah", "hannukah", "Diwali", "diwali"];
//keeps track of all the usernames of the chat room
var usernames=[];
// keeps track of group admin
var roomowner = [];
// keeps track of users in the room, which filter is activated in the room, and the public/private status
var chatrooms2 = {};
chatrooms2.room = [];
chatrooms2.room.push("General Chat");
chatrooms2.room["General Chat"] = [];
chatrooms2.room.filters=[];
chatrooms2.room.admin=[];
chatrooms2.room.username=[];
chatrooms2.room.public = [];
chatrooms2.room["General Chat"].filters = [];
chatrooms2.room["General Chat"].filters["profanity"]=1;
chatrooms2.room["General Chat"].filters["politics"]=0;
chatrooms2.room["General Chat"].filters["religion"]=0;
chatrooms2.room["General Chat"].public = [];
chatrooms2.room["General Chat"].public = "true";
chatrooms2.room["General Chat"].bannedUsers=[];
chatrooms2.room.currentusers=[];
chatrooms2.room["General Chat"].currentusers = [];
// keeps track of all current and banned users in the room
var rooms=[];
rooms.push("General Chat");
rooms["General Chat"] = {};
rooms["General Chat"].currentusers = [];
rooms["General Chat"].bannedUsers = [];
rooms.password=[];
var is_public=[];
is_public.push(chatrooms2.room["General Chat"].public);


io.sockets.on("connection", function (socket) {
    socket.on('message_to_server', function (data) {
        message=data["message"];
        // creative feature for filter. words related to profanity and sensitive topics like politics and religion are replaced with xxxxx
        if(chatrooms2.room[socket.room].filters["profanity"]==1){
            console.log("chatrooms2 profanity");
            console.log(chatrooms2.room["General Chat"].filters["profanity"]);
            var regex = /\w/;
            var messageresult = regex.test(message);
            console.log(messageresult);
            if (messageresult) {
                var Filter = require('bad-words');
                var filter = new Filter({ placeHolder: 'x'});
                    message = filter.clean(message);
            }
            
        }
        if(chatrooms2.room[socket.room].filters["politics"]==1){
            for(var i=0; i < politics_filter.length; i++){
                var new_str="";
                for(var j=0; j<politics_filter[i].length;j++){
                    new_str+="x";
                }
                var index = message.indexOf(politics_filter[i]);
                while(index>-1){
                    message = message.replace(politics_filter[i],new_str);
                    index = message.indexOf(politics_filter[i]);
                }
            }
        }
        if(chatrooms2.room[socket.room].filters["religion"]==1){
            for(var i=0; i < religion_filter.length; i++){
                var new_str="";
                for(var j=0; j<religion_filter[i].length;j++){
                    new_str+="x";
                }
                var index = message.indexOf(religion_filter[i]);
                while(index>-1){
                    message = message.replace(religion_filter[i],new_str);
                    index = message.indexOf(religion_filter[i]);
                }
            }
        }
        // emojis creative feature 
        if (message.includes(" :)")) {
            message = message.replace(" :)", " 😊")
        }
        if (message.includes(" :D")) {
            message = message.replace(" :D", " 😄")
        }
        if (message.includes(" :(")) {
            message = message.replace(" :(", " 😞")
        }
        if (message.includes(" :p")) {
            message = message.replace(" :p", " 😛")
        }
        if (message.includes(" :P")) {
            message = message.replace(" :P", " 😛")
        }
        if (message == ":)") {
            message = "😊";
        }
        if (message == ":(") {
            message = "😞";
        }
        if (message == ":D") {
            message = "😄";
        }
        if (message == ":p") {
            message = "😛";
        }
        if (message == ":P") {
            message = "😛";
        }



        console.log("message: " + socket.username + ": " + data["message"]);
        io.in(socket.room).emit("message_to_client", { message: "(Room: " + socket.room + ") " + socket.username + ": " + message })
    });
    // creative feature of uploading an image and sending it as a message
    socket.on("image_to_server", function(data){
        var url = data["url"];
        console.log(url);
        io.in(socket.room).emit("image_to_client",{message: socket.username+": ",url:url})
    });
    // sending a private message 
    socket.on('privateMessage', function(data){
        var regex = /\w/;
        var message = data["message"];
        var messageresult = regex.test(message);
        console.log(messageresult);
        if (messageresult) {
            var Filter = require('bad-words');
            var filter = new Filter({ placeHolder: 'x'});
            message = filter.clean(message);
        }
        if (message.includes(" :)")) {
            message = message.replace(" :)", " 😊")
        }
        if (message.includes(" :D")) {
            message = message.replace(" :D", " 😄")
        }
        if (message.includes(" :(")) {
            message = message.replace(" :(", " 😞")
        }
        if (message.includes(" :p")) {
            message = message.replace(" :p", " 😛")
        }
        if (message.includes(" :P")) {
            message = message.replace(" :P", " 😛")
        }
        if (message == ":)") {
            message = "😊";
        }
        if (message == ":(") {
            message = "😞";
        }
        if (message == ":D") {
            message = "😄";
        }
        if (message == ":p") {
            message = "😛";
        }
        if (message == ":P") {
            message = "😛";
        }
        var target = data["target"];
        const is_active = rooms[socket.room].currentusers.indexOf(target);
        // only sends message is user message being sent to is also in the room
        if(is_active > -1){
            io.in(socket.room).emit("privateToClient", {message:message, sender:socket.username, target:target})
        }else{
            io.in(socket.room).emit("privateFailed", {user:socket.username})
        }
    });
    // this function handles the log in
    socket.on("login", function(data){
        var username = data["username"];
        socket.username = username;
        var userpresent = false;
        // no duplicate users
        for (var i =0; i<usernames.length; i++) {
            if(usernames[i] == username) {
                userpresent = true;
            }
        }
        if (userpresent == false) {
            usernames.push(username);
            rooms["General Chat"].currentusers.push(username);
            chatrooms2.room["General Chat"].push(username);
            chatrooms2.room["General Chat"].currentusers.push(username);
        }
        // users automatically put into general chat
        usernames[username] = username;
        socket.room = "General Chat";
        socket.join(socket.room);
        io.in(socket.room).emit("afterlogin");
        io.in(socket.room).emit("displayjoin", {username: socket.username});   
        socket.emit("welcomeuser", {username: socket.username}); 
        io.in(socket.room).emit("roomusers", {username: socket.username, chatroom: chatrooms2.room["General Chat"]}); 
        io.in(socket.room).emit("currentroom", {currentroom: socket.room});
        io.sockets.emit("roomdropdown", {currentroom: socket.room, public:is_public, chatroom: chatrooms2.room});
        
    }); 
    // creating a new room
    socket.on("createRoom", function(createnewroom, username, prof_filter, pol_filter, rel_filter){
        rooms.push(createnewroom);
        roomowner.push(createnewroom);
        roomowner[createnewroom] = username;
        // the person who created the new room is automatically put into it but first they are taken out from the 
        // room they were previously in
        for (var i=0; i<chatrooms2.room[socket.room].length; i++) {
            if(chatrooms2.room[socket.room][i].constructor === Array){
                for (var j=0; j<chatrooms2.room[socket.room][i].length; j++) {
                    if(chatrooms2.room[socket.room][i][j]===socket.username){
                        chatrooms2.room[socket.room][i].splice(j,1);
                        io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]});
                        j--;
                    }
                   
                }
            }else{
                if(chatrooms2.room[socket.room][i]===socket.username){
                    chatrooms2.room[socket.room].splice(i,1);
                                            
                    i--;
                }
            }
            
            io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]});   
        }
        socket.leave(socket.room);
        socket.room=createnewroom;   
        socket.join(socket.room);  
        rooms[createnewroom] = {};
        rooms[createnewroom].currentusers =[];
        rooms[createnewroom].currentusers.push(socket.username);
        rooms[createnewroom].public = "true";
        rooms[createnewroom].admin = username;
        rooms[createnewroom].bannedUsers = [];
        rooms[createnewroom].filters=["profanity", "politics", "religion"];
        rooms[createnewroom].filters["profanity"]=prof_filter;
        rooms[createnewroom].filters["politics"]= pol_filter;
        rooms[createnewroom].filters["relgiion"]=rel_filter;
        // they created the room so they can see the kick and ban buttons
        io.in(socket.room).emit("showOwnerTools");
        chatrooms2.room.push(createnewroom);
        chatrooms2.room[createnewroom]=[];
        chatrooms2.room[createnewroom].filters = [];
        chatrooms2.room[createnewroom].filters["profanity"]=prof_filter;;
        chatrooms2.room[createnewroom].filters["politics"]=pol_filter;
        chatrooms2.room[createnewroom].filters["religion"]=rel_filter;
        chatrooms2.room[createnewroom].public = [];
        chatrooms2.room[createnewroom].public = "true";
        chatrooms2.room[createnewroom].admin=username;
        chatrooms2.room[createnewroom].bannedUsers=[];
        chatrooms2.room[createnewroom].push(rooms[socket.room].currentusers);
        is_public.push(chatrooms2.room[createnewroom].public);
        io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], testuser: rooms[createnewroom], chatroom: chatrooms2.room[createnewroom]});
        io.sockets.emit("roomdropdown", {currentroom: socket.room, public:is_public, chatroom: chatrooms2.room});
        io.in(socket.room).emit("currentroom", {currentroom: socket.room});
    });
    // creating a new private room 
    socket.on("createPrivateRoom", function(createnewroom, username, password, prof_filter, pol_filter, rel_filter){
        rooms.push(createnewroom);
        roomowner.push(createnewroom);
        roomowner[createnewroom] = username;
        // the person who created the new room is automatically put into it but first they are taken out from the 
        // room they were previously in
        for (var i=0; i<chatrooms2.room[socket.room].length; i++) {
            if(chatrooms2.room[socket.room][i].constructor === Array){
                for (var j=0; j<chatrooms2.room[socket.room][i].length; j++) {
                    if(chatrooms2.room[socket.room][i][j]===socket.username){
                        chatrooms2.room[socket.room][i].splice(j,1);
                        j--;
                    }
                   
                }
            }else{
                if(chatrooms2.room[socket.room][i]===socket.username){
                    chatrooms2.room[socket.room].splice(i,1);                                            
                    i--;
                }
            }
            io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]});  
        }
        io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]});   
        socket.leave(socket.room);
        socket.room=createnewroom;   
        socket.join(socket.room);
        rooms[createnewroom] = {};
        rooms[createnewroom].currentusers =[];
        rooms[createnewroom].currentusers.push(socket.username);
        rooms[createnewroom].public = "false";
        rooms[createnewroom].password=[];
        rooms[createnewroom].password = password;
        rooms[createnewroom].admin = username;
        rooms[createnewroom].bannedUsers = [];
        rooms[createnewroom].filters=["profanity", "politics", "religion"];
        rooms[createnewroom].filters["profanity"]=prof_filter;
        rooms[createnewroom].filters["politics"]= pol_filter;
        rooms[createnewroom].filters["relgiion"]=rel_filter;
        // they created the room so they can see the kick and ban buttons
        io.in(socket.room).emit("showOwnerTools");
        chatrooms2.room.push(createnewroom);
        chatrooms2.room[createnewroom]=[];
        chatrooms2.room[createnewroom].filters = [];
        chatrooms2.room[createnewroom].filters["profanity"]=prof_filter;;
        chatrooms2.room[createnewroom].filters["politics"]=pol_filter;
        chatrooms2.room[createnewroom].filters["religion"]=rel_filter;
        chatrooms2.room[createnewroom].public = [];
        // setting public to false cause its a private room
        chatrooms2.room[createnewroom].public = "false";
        chatrooms2.room[createnewroom].admin=username;
        chatrooms2.room[createnewroom].password=password;
        chatrooms2.room[createnewroom].bannedUsers=[];
        chatrooms2.room[createnewroom].push(rooms[socket.room].currentusers);
        is_public.push(chatrooms2.room[createnewroom].public);
        io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], testuser: rooms[createnewroom], chatroom: chatrooms2.room[createnewroom]});
        io.sockets.emit("roomdropdown", {currentroom: socket.room, public:is_public, chatroom: chatrooms2.room});
        io.in(socket.room).emit("currentroom", {currentroom: socket.room});
    });
    // function to change rooms
    socket.on("changeRooms", function(data){
        var target = data["room"];
        var check = data["check"];
        console.log(target);
        console.log(socket.room);
        var is_banned = 0;
        for(var i = 0;i<rooms[target].bannedUsers.length;i++){
            if(rooms[target].bannedUsers[i]==socket.username){
                is_banned=1;
            }
        }
        // banned users cannot change into a room theyre banend from
        if(is_banned == 1){
            io.sockets.to(socket.id).emit("youAreBanned");
        }else{
            // if room is private, they are first asked for the password
            if(rooms[target].public == "false" && check==false){
                io.sockets.to(socket.id).emit("privateSwitch", {password: rooms[target].password, target:target});
            }else{
                // user is first taken out from the 
            //       room they were previously in
                if(chatrooms2.room[socket.room]!==undefined){
                    for (var i=0; i<chatrooms2.room[socket.room].length; i++) {
                        if(chatrooms2.room[socket.room][i].constructor === Array){
                            for (var j=0; j<chatrooms2.room[socket.room][i].length; j++) {
                                if(chatrooms2.room[socket.room][i][j]===socket.username){
                                    chatrooms2.room[socket.room][i].splice(j,1);
                                    io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]});
                                    j--;
                                }
                               
                            }
                        }else{
                            if(chatrooms2.room[socket.room][i]===socket.username){
                                chatrooms2.room[socket.room].splice(i,1);
                                                        
                                i--;
                            }
                        }
                        io.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]});   
                    }
                    socket.leave(socket.room);
                    io.sockets.in(socket.room).emit("roomusers", {chatroom: chatrooms2.room[socket.room]}); 
                    console.log(rooms[socket.room].currentusers);
                    socket.room=target;
                    socket.join(socket.room);
                    rooms[socket.room].currentusers.push(socket.username);
                    // if the user was the owner of this room, they can see the kick and ban buttons
                    if(socket.username==rooms[socket.room].admin){
                        socket.emit("showOwnerTools");
                    }
                    else{
                        socket.emit("hideOwnerTools");
                    }
                        chatrooms2.room[socket.room].push(rooms[socket.room].currentusers);
                        console.log("changeRooms chatrooms console logs")
                        console.log(chatrooms2);
                        console.log(chatrooms2.room[socket.room]);
                    io.sockets.in(socket.room).emit("roomusers", {owner: roomowner[socket.room], chatroom: chatrooms2.room[socket.room]}); 
                    io.sockets.to(socket.id).emit("currentroom", {currentroom: socket.room});
                    io.sockets.emit("roomdropdown", {currentroom: socket.room, public:is_public, chatroom: chatrooms2.room});
                }
                
            }
        }        
    });
    // used to ban and kick users
    socket.on("adminControls", function(data){
        var username = data["username"];
        var ban_value = data["ban"];
        // putting the user into a list of banned users
        if(ban_value==1){
            rooms[socket.room].bannedUsers.push(username);

        }
        
        const index = rooms[socket.room].currentusers.indexOf(username);
        if(index > -1) {
            io.in(socket.room).emit('kickTarget', username);
               
        }else{
            // cant ban or kick someone if theyre not even in the room
            if(ban_value==0){ 
                io.in(socket.room).emit('kickFailed', {user:socket.username});
            }
        }
    });

    // used to disconnect a user from the chat server. they are removed from the room theyre in and theyre also removed
    // from the usernames array
    socket.on("disconnect", function(){
        if(rooms[socket.room] !=undefined){
            for (var i=0; i<chatrooms2.room[socket.room].length; i++) {
                if(chatrooms2.room[socket.room][i].constructor === Array){
                    for (var j=0; j<chatrooms2.room[socket.room][i].length; j++) {
                        if(chatrooms2.room[socket.room][i][j]===socket.username){
                            chatrooms2.room[socket.room][i].splice(j,1);
                            j--;
                        }
                    
                    }
                }else{
                    if(chatrooms2.room[socket.room][i]===socket.username){
                        chatrooms2.room[socket.room].splice(i,1);                                            
                        i--;
                    }
                }
            }
            io.in(socket.room).emit("roomusers", {chatroom: chatrooms2.room[socket.room]});  
        }
        const index_users = usernames.indexOf(socket.username);
        if (index_users > -1) {
            usernames.splice(index_users, 1);
        }  
    })
});