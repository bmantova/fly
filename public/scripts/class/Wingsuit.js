class Wingsuit extends FlyingObject {
	constructor(model, position, rotation) {
		super(model, position,rotation)
	}
}
class MyWingsuit extends Wingsuit {
	constructor(model, position, rotation) {
		super(model, position,rotation)
		this.life = 10;
		this.speed = 0.5;
		this.maxSpeed = 2;
		this.acceleration = 0.01;
		this.speedZMove = 0.1;
		this.speedXMove = 0.04;
	}
	ejectFrom(elem) {
		this.model.position.copy(elem.position);
		this.model.rotation.copy(elem.rotation);
	}
	loop() {
		res('W_position',virg(this.position.x)+','+virg(this.position.y)+','+virg(this.position.z))
		this.moveForward();
		this.checkKeys();
		//this.processGravity();
		//this.checkCollisions()
		this.cameraDistance = limit(-(1+3*this.speed),-50,0);
	}
	/*processGravity() {
		res('rotationSuit',virg(this.rotation._x)+','+virg(this.rotation._y)+','+virg(this.rotation._z))
		res('sinX',virg(Math.sin(this.rotation._x)))
		this.speed = limit(this.speed + Math.sin(this.rotation._x) * this.acceleration,0,this.maxSpeed)
		this.model.position.y -= (this.gravity * (this.maxSpeed-this.speed))/10;
	}*/
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
		if(this.lastC && !keyboard.isPressed('C')) {
			if(this.stop) this.stop = false;
			else this.stop = true;
		}
		if(keyboard.isPressed('C'))this.lastC = true;
		else this.lastC = false;
	}
	stabilizeX() {

	}
	stabilizeZ() {
		
	}
}