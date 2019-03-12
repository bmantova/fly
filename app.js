/**
 * @file Initiates the server and gets all required packages.
 * @author TheCodeCrafter <noahcoder77@gmail.com>
 */

/* Requirements */
 var express = require('express');
var app = require('express')();
const server = require('http').createServer(app);
var io = require('socket.io')(server);

/* Settings/Local Requirements */
//var config = require('./config.json');
io.set('origins', 'http://localhost:* http://http://192.168.43.107:*');
/* Routing */
app.use(express.static(__dirname + '/public'));

/* Variables */

/* Logic */
io.sockets.on('connection', function (socket) {
  //socket.emit('message', "YAS");
  setupEvents(socket);
});

const pool = require('./public/config/config');

function setupEvents(socket) {
  // Connection Events
    socket.on('getId', function (message) {
        
        pool.query('SELECT * FROM players ORDER BY id DESC LIMIT 1',(error, result)=>{
            if (error) throw error;
            let id;
            (result === undefined || result[0] === undefined)? id = 1 : id = result[0].id+1;
            pool.query('INSERT INTO players(id,position, data, lastUpdate) VALUES (?,?,?,NOW()) ', [id,'{"x": 0, "y": 0, "z": 0}','{"speed": 1, "rot": {"_x": 1.0, "_y": 1.0, "_z": 1.0}}'],(error, result) => {
                if (error) throw error;
                socket.emit('userId',id);
            });
        })

        
    });

    socket.on('update', function (json){
        const obj = JSON.parse(json);
        pool.query("DELETE FROM `players` WHERE lastUpdate < DATE_SUB(NOW(),INTERVAL 30 SECOND)")
        pool.query("DELETE FROM `shot` WHERE shotTime < DATE_SUB(NOW(),INTERVAL 10 SECOND)")
        for(let hit of obj.hits) {
            pool.query('UPDATE shot SET hitted = ? WHERE id = ?',[hit.t,hit.i]);
        }
        pool.query('UPDATE players SET data=?, position=?, lastUpdate=NOW() WHERE id=?;', [JSON.stringify(obj.data),JSON.stringify(obj.position),obj.id],(error, result) => {
            if (error) throw error;
            if(obj.dataShot != "" && obj.dataShot){
                pool.query('INSERT INTO shot(idPlayer, data) VALUES (?,?)',[obj.id, JSON.stringify({'p':obj.position,'r':obj.data.rot})],(error, result) =>{
                    if (error) throw error;
                });
            }
        });

        pool.query('SELECT * FROM players WHERE id != ?',[obj.id],(error, result)=>{
            if (error) throw error;
           // pool.query('SELECT * FROM shot WHERE idPlayer != ? AND  n, > ?',[obj.id, obj.lastUpdate],(err, res)=>{
            pool.query('SELECT id, data FROM shot WHERE idPlayer != ? AND id > ?',[obj.id,obj.lb],(err, res)=>{
                if (err) throw err;
                pool.query("SELECT hitted FROM shot WHERE idPlayer = ? AND hitted != 'NULL'",[obj.id],(err,hitres)=> {
                    if (err) throw err;
                    pool.query("DELETE FROM `shot` WHERE idPlayer = ? AND hitted != 'NULL'",[obj.id])
                    socket.emit('update',JSON.stringify({players: result,shots:res,hits:hitres}));
                });
            });
        });
    });
}

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})