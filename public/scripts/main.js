var app = new AppController();      

app.socket.on('userId', function(message) {
    const myId = message;	console.log(myId);

    app.mainPlane.setId(myId);
    update(myId,app.mainPlane);
})
let reponse = {data:0,pos:0,model:0,pos3d:0,rot:0,speed:0,id:0};
app.socket.on('update',function(mess){
	let obj = JSON.parse(mess);
	if(obj.hits && obj.hits != '') console.log(obj.hits)
	for(let i=0; i < obj.players.length; i++){
		reponse.data = JSON.parse(obj.players[i].data);
		reponse.pos = JSON.parse(obj.players[i].position);
		reponse.model = app.loader.models['plane2'].children[0].clone();
		reponse.pos3d = new THREE.Vector3(reponse.pos.x,reponse.pos.y,reponse.pos.z);
		reponse.rot = new THREE.Vector3(reponse.data.rot._x,reponse.data.rot._y,reponse.data.rot._z);
		reponse.speed = reponse.data.s;
		reponse.id= obj.players[i].id;

		if(app.allPlane[reponse.id]){
			app.allPlane[reponse.id].update(reponse.pos3d,reponse.rot,reponse.speed,reponse.data.d);
		}
		else{
			app.allPlane[reponse.id] = new OtherPlane(reponse.id,reponse.model,reponse.pos3d,reponse.rot,reponse.speed,"0xff0000");
		}
	}
	for(let h of obj.hits) {
		switch(h.t) {
			case 'dead':
				app.mainPlane.addScore(100);
				app.addKill();
				break;
			case 'touch':
				app.mainPlane.addScore(10);
				break;
		}
	}
	res("shotLength",obj.shots.length)
	res("lastIdBullet",app.bulletManager.maxIdProccessed)
	for(let shot of obj.shots) {
		reponse.data = JSON.parse(shot.data)
		app.bulletManager.setMaxId(shot.id);
		app.bulletManager.addBufferShot(reponse.data.p,reponse.data.r,shot.id,0xff0000);
	}
	update(app.mainPlane.id,app.mainPlane)
})

function update(id,plane) {
    app.socket.emit('update', JSON.stringify({ id: id, data: {s: plane.speed.toFixed(3), rot: plane.rotationMin,l:plane.life,d:plane.dead}, position: plane.positionMin, dataShot: app.bulletManager.parse(),lb:app.bulletManager.maxIdProccessed,hits:app.bulletManager.hittedShots()}));
}


/*function mainRequest(id,plane){
	var payload = {
		data: JSON.stringify({s: plane.speed, rot: plane.rotation}),
		position: JSON.stringify(plane.position),
		dataShot: ""
	};
	var mainReq = new RequestController("/player/"+id, "PUT",payload);
	mainReq.send().then(function(rep){
		if(rep.success){
			for(var i=0; i < rep.players.length; i++){
				var pos = JSON.parse(rep.players[i].position);
				var data = JSON.parse(rep.players[i].data);
				var model = app.loader.models['plane'].children[0].clone();
				var pos3d = new THREE.Vector3(pos.x,pos.y,pos.z);
				var rot = new THREE.Vector3(data.rot._x,data.rot._y,data.rot._z);
				var speed = data.s;
				var id= rep.players[i].id;

				if(app.allPlane[id]){
					app.allPlane[id].update(pos3d,rot,speed);
				}
				else{
					app.allPlane[id] = new OtherPlane(id,model,pos3d,rot,speed,"0xff0000");
				}
			}
			mainRequest(id,plane);
		}
	});
}*/