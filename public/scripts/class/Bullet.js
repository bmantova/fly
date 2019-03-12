class Bullet {
	constructor(plane) {
		this.plane = plane;
		this.buffetBullet = false;
		this.allShots = [];
		this.shotBuffer = []
		this.maxIdProccessed = 0;
		this.reloadTime = 4;
		this.rayCollider = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(),0,500);
		this.hittedShotsBuffer = [];
	}
	loop() {
		this.removeAllOldShots();
		if(this.buffetBullet) this.displayCurrentPlaneShot();
		this.displayBuffer();
		this.buffetBullet = false;
	}
	shot() {
		if(app.t%this.reloadTime == 0) this.buffetBullet = true;
	}
	addBufferShot(pos,rot,id,color = 0xff9900) {
		this.shotBuffer.push({pos:pos,rot:rot,color:color,id:id});
	}
	displayBuffer() {
		let buf = this.shotBuffer.splice(0,this.shotBuffer.length)
		for(let s of buf) {
			let pos = new THREE.Vector3(parseFloat(s.pos.x),parseFloat(s.pos.y),parseFloat(s.pos.z));
			let rotn = this.getRotationDir(s.rot);
			rotn.normalize();
			this.rayCollider.set(pos,rotn);
			const collision = this.rayCollider.intersectObject(this.plane.model)
			if(collision.length > 0) {
				this.plane.isHit();
				if(this.plane.life < 0) this.addHittedShot('dead',s.id);
				else this.addHittedShot('touch',s.id)
			}
			this.displayShot(pos,s.rot,s.color)
		}

	}
	parse() {
		return this.buffetBullet;
	}
	hittedShots() {
		return this.hittedShotsBuffer.splice(0,this.hittedShotsBuffer.length);
	}
	addHittedShot(type,id) {
		this.hittedShotsBuffer.push({t:type,i:id});
	}
	displayCurrentPlaneShot() {

		this.displayShot(this.plane.position,this.plane.rotation);
	}
	getRotationDir(rot,length = 1) {
		let dir = new THREE.Vector3(0,0,length);
		dir.applyEuler(new THREE.Euler(parseFloat(rot._x),parseFloat(rot._y),parseFloat(rot._z)));
		return dir;
	}
	displayShot(pos,rot,color = 0xff9900) {
		if(rot.x && rot.y && rot.z) {
			const r = 10;
			let geom = new THREE.Geometry();
			geom.vertices.push(new THREE.Vector3(pos.x,pos.y,pos.z));
			let projection = this.getRotationDir(rot,100);
			projection.add(pos);
			geom.vertices.push(projection)
			let mat = new THREE.LineBasicMaterial( { color: color,linewidth: 3 } );
			this.allShots.push(app.three.addObject(new THREE.Line(geom, mat)));
		}
	}
	removeAllOldShots() {
		let old = this.allShots.splice(0,this.allShots.length)
		for(let shot of old) {
			app.three.rmObject(shot);
		}
	}
	setMaxId(id) {
		if(id > this.maxIdProccessed) this.maxIdProccessed = id;
		return this.maxIdProccessed;
	}
}