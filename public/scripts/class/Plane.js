class Plane extends FlyingObject{

	spline(){
		if(Plane.PLANE_SPLINE){
			const length = 2+this.speed;
			


			let dir = new THREE.Vector3(0,0,-length);
			dir.applyEuler(new THREE.Euler(parseFloat(this.rotation.x),parseFloat(this.rotation.y),parseFloat(this.rotation.z)));

			let width = new THREE.Vector3().copy(dir).multiply(this.model.geometry.boundingBox.max);

			let pos = new THREE.Vector3().copy(this.position).add(new THREE.Vector3(width.x,0,-width.z));
			var curve = new THREE.CubicBezierCurve3( 
				pos,
				new THREE.Vector3().copy(pos).add(new THREE.Vector3().copy(dir).multiply(new THREE.Vector3(0.25,0.25,0.25)).add(new THREE.Vector3(0.0,0.5,0.0))),
				new THREE.Vector3().copy(pos).add(new THREE.Vector3().copy(dir).multiply(new THREE.Vector3(0.75,0.75,0.75)).add(new THREE.Vector3(0.0,-0.5,0.0))),
				new THREE.Vector3().copy(pos).add(dir)
			);
			var points = curve.getPoints( 200 );
			var geometry = new THREE.BufferGeometry().setFromPoints( points );

			var material = new THREE.LineBasicMaterial( { color : 0xffffff, linewidth: 20 } );

			// Create the final object to add to the scene
			var curveObject = new THREE.Line( geometry, material );
			app.three.addObject(curveObject);
		}
		
	}
	fumee() {
		var curIndice = this.nFumee%Plane.FUMEE_SIZE
		if(this.fumeeArray[curIndice]) {
			app.three.rmObject(this.fumeeArray[curIndice]);
			this.fumeeArray[curIndice] = false;
		}
		if(Plane.FUMEE_MODE) {
			var geometry = new THREE.SphereGeometry( randfloat(0.1,0.3), 5, 5 );
			var material = new THREE.MeshBasicMaterial( { color: 0x888888 } );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.copy(this.position)
			cube.position.add(new THREE.Vector3(randfloat(-0.2,0.2),randfloat(-0.2,0.2),randfloat(-0.2,0.2)))
			this.fumeeArray[curIndice] = app.three.addObject( cube );
			this.nFumee++;
		}

	}
	debugPoint(pos) {
		var geometry = new THREE.SphereGeometry( 0.2, 2, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.copy(pos)
		app.three.addObject( cube );

	}
	death() {
		app.addDeath();
		this.dead = true;
		this.model.visible = false;
		this.speed = 0;
		if(this.explode){
			this.explode.visible = true;
		}
		else{
			this.explode = app.loader.models['explode'].children[0].clone();
			app.three.addObject(this.explode); 
		}
		this.explode.position.copy(this.position)
		this.deadTime = app.t;
		this.revertScale = 1;
	}
	explodeProcess()
	{
		if(this.dead) {
			if((app.t - this.deadTime) < 20){
				this.explode.geometry.scale(1.1,1.1,1.1)
				this.cameraDistance = -(app.t - this.deadTime);
				this.revertScale *= 1.1;
			}
			else if((app.t - this.deadTime) < 30) {
				this.explode.geometry.scale(1/(1.1*2),1/(1.1*2),1/(1.1*2));
				this.revertScale *= 1/(1.1*2);
			}
			else {
				if((app.t - this.deadTime)> 60) this.reset();
			}
		}
	}
	reset() {
		this.explode.visible = false;
		this.explode.geometry.scale(1/this.revertScale,1/this.revertScale,1/this.revertScale);
		this.explode.scale.set(1,1,1);
		this.life = 100;
	}
	constructor(model, position, rotation) {
		super(model, position,rotation)
	}
}
Plane.PLANE_SPLINE = false;
Plane.TRACE_MODE = false;
Plane.FUMEE_MODE = true;
Plane.FUMEE_SIZE = 50;
Plane.RAY_DIRECTIONS = [
	new THREE.Vector3(1,0,0),
	new THREE.Vector3(-1,0,0)
];

class MyPlane extends Plane {
	loop() {
		if(!this.dead) {
			if(this.life < 0 || this.checkCollisions()) this.death();
			res('position',virg(this.position.x)+','+virg(this.position.y)+','+virg(this.position.z))
			res('speed',virg(this.speed))
			res('rotationX',virg(this.rotation.x))
			res('rotationY',virg(this.rotation.y))
			res('rotationZ',virg(this.rotation.z))
			res('maxSPEED',virg(this.maxSpeed	))
			res('life',virg(this.life))
			this.checkKeys();
			if(!this.stop){
				this.moveForward();
				this.tracePath();
				if(this.accelere) this.speedUp();
				else this.speedDown();
				if(this.life < 40 && Plane.FUMEE_MODE) this.fumee();
			}
			this.spline();
			this.cameraDistance = -(3+4*this.speed);
		} 
		else {
			this.explodeProcess();

		}
	}
	reset() {
		this.accelere = false;
		this.dead = false;
		this.explode.visible = false;
		this.explode.geometry.scale(1/this.revertScale,1/this.revertScale,1/this.revertScale);
		this.model.visible = true;
		this.model.position.copy(this.initialPosition);
		this.model.rotation.set(0,0,0);
		this.life = 100;
		this.accVal = 0;
	}
	checkKeys() {
		if(keyboard.isPressed('LEFT') || keyboard.isPressed('Q')) {
			this.rotateZ(-this.speedZMove);
		}
		else if(keyboard.isPressed('RIGHT') || keyboard.isPressed('D')) {
			this.rotateZ(this.speedZMove);
		}
		else {
			this.stabilizeZ();
		}

		if(keyboard.isPressed('UP') || keyboard.isPressed('Z')) {
			this.rotateX(this.speedXMove);
		}
		else if(keyboard.isPressed('DOWN') || keyboard.isPressed('S')) {
			this.rotateX(-this.speedXMove);
		}
		else {
			this.stabilizeX();
		}

		if(keyboard.isPressed('SPACE')) {
			this.shoot();
		}
		if((keyboard.isPressed('A') || keyboard.isPressed('0')) && !this.lastA && app.t - this.lastModifA > 5){
			this.lastModifA = app.t;
			if(this.accelere){
				this.accelere = false;
			} 
			else {
				this.accelere = true;
			}
		}
		if(this.lastC && !keyboard.isPressed('C')) {
			if(this.stop) this.stop = false;
			else this.stop = true;
		}
		if(keyboard.isPressed('C'))this.lastC = true;
		else this.lastC = false;
		
		if(this.lastE && !keyboard.isPressed('E')) {
			app.eject();
		}
		if(keyboard.isPressed('E'))this.lastE = true;
		else this.lastE = false;
	}
	stabilizeX() {

	}
	stabilizeZ() {
		
	}
	shoot() {
		app.bulletManager.shot();
	}
	speedUp() {
		this.accVal = limit(this.accVal + this.acceleration,0,this.maxAcc);
	}
	speedDown() {
		this.accVal = limit(this.accVal - this.acceleration,0,this.maxAcc);
	}
	constructor(model, position, rotation) {
		super(model, position, rotation);
		this.color = 0xffff00;
		this.maxSpeed = 2;
		this.acceleration = 0.01;
		this.speedZMove = 0.1;
		this.speedXMove = 0.04;
		this.lastA = false;
		this.accelere = false;
		this.lastModifA = -50;
		this.maxAcc = 0.5;
	}
}

class OtherPlane extends Plane {
	loop() {
		if(this.life < 40 || Plane.FUMEE_MODE) this.fumee();
		this.model.translateZ(this.speed);
	}
	update(newPos, newRot,newSpeed,dead) {
		//if(!this.dead && dead) this.death();
		this.model.position.copy(newPos);
		this.model.rotation.set(newRot.x,newRot.y,newRot.z);
		this.tracePath();
		this.speed = parseInt(newSpeed);
		//if(this.dead) this.explodeProcess();
	}
	constructor(id, model, position, rotation, speed, color) {
		super(model, position, rotation);
		this.speed = speed;
		this.color = color;
		this.id = id;
		app.three.addObject(this.model);
	}
}
Plane.ENABLE_STABLISATION = false;