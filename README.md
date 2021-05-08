# CSE330
Irtaza Waseem 472936 irtaza210

Mason Kelber 474183 Mkelber

Instructions for the TA:
It is highly recommended to watch this video which details how our chat website works and how to use all of the functions of the website
https://www.youtube.com/watch?v=N3qfXeHbNi4

To run the chat app, the following commands must be run. Failing to run any one of these commands will cause the program to break and nothing will work.
1. npm install
2. npm install socket.io --save
3. **npm install bad-words --save**
4. node chat-server.js
5. In your browser, type the following as the URL: http://localhost:3456/

Statement 3 is important to run because the bad-words package has been partially used for our filter implementation and so, if this package is not installed you will not be able to send any messages because the program will just crash. So it is very important that the command "npm install bad-words --save" is run the first time the TA runs the app.

Creative Features:
1. Profanity based, political based, and relgion based filters have been implemented. If a user inputs words related to these categories those words are replaced with xxxxx. No profanity is allowed on the General Chat but political and religious discussions are allowed. To see a list of all banned religious and political words, please see lines 16 and 17 of chat-server.js
2. When a user makes a new room, they have option to choose which filters they want to enforce and which filters they dont want. For example, it is possible to make
a public/private room that disallows political discussions but allows profanity and vice versa. 
3. Users can upload images as messages
4. Smiley face, sad face, very happy face, and tongue out face emojis are displayed when user's message contains ":)" , ":(", ":D" and ":p" respectively
5. The number of current users in each room is displayed

# Grading
-0.5pts - no package json file, if package json is added then those additional setup commands wouldn't be needed
