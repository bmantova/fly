class FlyingObject {
	rotateX(a) {
		this.model.rotateX(a);
	}
	rotateY(a) {
		this.model.rotateY(a);
	}
	rotateZ(a) {
		this.model.rotateZ(a);
	}
	rotate(x,y,z) {
		this.rotateX(x);
		this.rotateY(y);
		this.rotateZ(z);
	}
	get position() {
		return this.model.position;
	}
	get rotation() {
		return this.model.rotation;
	}
	get positionMin() {
		return {x:this.model.position.x.toFixed(3),
				y:this.model.position.y.toFixed(3),
				z:this.model.position.z.toFixed(3)};
	}
	get rotationMin() {
		return {_x:this.model.rotation._x.toFixed(5),
				_y:this.model.rotation._y.toFixed(5),
				_z:this.model.rotation._z.toFixed(5)};
	}
	get polar() {
		let r = Math.sqrt(this.model.rotation._z*this.model.rotation._z + this.model.rotation._y*this.model.rotation._y + this.model.rotation._x*this.model.rotation._x);
		return {r : r,
				rho : Math.acos(this.model.rotation._z/r),
				theta : Math.atan(this.model.rotation._y/this.model.rotation._x)};
	}
	setId(id) {
		this.id = id;
	}
	processBoundingBox() {
		this.model.geometry.computeBoundingBox();
		// this.model.geometry.boundingBox.max / min
	}
	checkCollisions() {
		if(this.position.y < 0) return true;
		let i = 0;
		while(i < Plane.RAY_DIRECTIONS.length)
		{
			this.rayCollider.set(this.position,Plane.RAY_DIRECTIONS[i]);
			const collision = this.rayCollider.intersectObjects(this.colliders,true)
			if(collision.length > 0) {
				return true;
			}
			i++;
		}
		return false;
	}
	addCollider(object) {
		this.colliders.push(object);
	}
	/*moveForward() {
		this.model.translateZ(this.speed);
	}*/
	tracePath() {
		if(Plane.TRACE_MODE && this.speed > 0) {
			var geometry = new THREE.SphereGeometry( 0.2, 2, 2 );
			var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.copy(this.position)
			app.three.addObject( cube );
		}
	}
	isHit() {
		this.life -= 20;
	}
	invisible() {
		this.model.visible = false;
	}
	visible() {
		this.model.visible = true;
	}
	moveForward() {
		this.speed = limit(this.speed + (Math.sin(this.rotation._x) + this.accVal) * this.acceleration,0,this.maxSpeed) /* Mettre ça dans flyingObject */
		this.model.position.y -= this.gravity * (this.maxSpeed-this.speed)/5; /* ICI -> 1/2 *g * t^2 */
		this.model.translateZ(this.speed);
	}
	constructor(model, position, rotation) {
		this.model = model;
		this.model.castShadow = true;
		this.model.position.copy(position);
		this.initialPosition = position.clone();
		this.model.rotateX(rotation.x);
		this.model.rotateY(rotation.y);
		this.model.rotateZ(rotation.z);
		this.colliders = [];
		this.frontBottomLeftCorner = new THREE.Vector3();
		this.backTopRihtCorner = new THREE.Vector3();
		this.processBoundingBox();
		this.fumeeArray = [];
		this.nFumee = 0;
		this.stop = false;
		this.accVal = 0;
		this.maxAcc = 0;

		this.dead = false;
		this.life = 100;
		this.speed = 0;

		this.rayCollider = new THREE.Raycaster(this.position.clone(), new THREE.Vector3(),0,this.model.geometry.boundingBox.max.length()*2);

		this.gravity = 1.0;
		app.three.addObject(this.model);
	}
}