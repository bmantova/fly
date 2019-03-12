class ThreeController {
	render() {
		this.renderer.render(this.scene, this.camera);
	}
	resizeEvent() {
		var self = this;
		window.addEventListener('resize',function(){
	        self.camera.aspect = window.innerWidth/window.innerHeight;
	        self.camera.updateProjectionMatrix()
	        self.renderer.setSize(window.innerWidth, window.innerHeight)
		},false);
	}
	addObject(elem) {
		this.scene.add(elem);
		return elem;
	}
	rmObject(elem) {
		this.scene.remove(elem);
	}
	follow(elem) {
		this.objectFollow = elem;
	}
	setCameraPosition(distance) {
		if(this.objectFollow && !this.objectFollow.stop){
			this.camera.position.copy(this.objectFollow.position);
			this.camera.rotation.x = this.objectFollow.rotation.x;
			this.camera.rotation.y = this.objectFollow.rotation.y;
			this.camera.rotation.z = this.objectFollow.rotation.z;
			this.camera.translateZ(distance);//-(3+4*this.objectFollow.speed));
			this.camera.rotateY(Math.PI);
			this.camera.rotateX(-Math.PI/10);
			this.camera.translateY(2);
		}
	}
	setLightPosition(posTarget){
		this.mainLight.target.position.set(posTarget.x,posTarget.y,posTarget.z);
	}
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(85, window.innerWidth/window.innerHeight,0.1,1000);
		this.camera.position.z = 5;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.objectFollow = false;
		this.cameraSmooth = 0.1
		document.body.appendChild(this.renderer.domElement);

		this.mainLight = new THREE.DirectionalLight(0xffffff, 0.7);
		this.mainLight.position.set(700,500,0);

		var target = new THREE.Object3D();
    	target.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    	this.mainLight.target = target;
    	this.scene.add(this.mainLight.target);

        this.orbit = new THREE.OrbitControls(this.camera)
        this.orbit.minDistance = 0.75
        this.orbit.maxDistance = 25
        this.orbit.enabled = true

		/*pointLight.shadow.camera = new THREE.OrthographicCamera( -100, 100, 100, -100, 0.5, 1000 ); 
		pointLight.position.set( -50, 50, 0 );
		pointLight.castShadow = true;
		pointLight.shadow.mapSize.width = 512;  // default
		pointLight.shadow.mapSize.height = 512; // default
		pointLight.shadow.camera.near = 0.5;       // default
		pointLight.shadow.camera.far = 1000; // default */

		this.mainLight.castShadow = true;
		this.mainLight.shadow.camera.left = -70
    	this.mainLight.shadow.camera.right = 70
    	this.mainLight.shadow.camera.top = 70
	    this.mainLight.shadow.camera.bottom = -70
	    this.mainLight.shadow.camera.near = 10
	    this.mainLight.shadow.camera.far = 1500
	    this.mainLight.shadow.mapSize.width = 2048
	    this.mainLight.shadow.mapSize.height = 2048
	   
        this.scene.add(this.mainLight)
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
		this.scene.background = new THREE.Color( 0xa0a0ff );


		/*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		this.cube = new THREE.Mesh( geometry, material );
		this.scene.add( this.cube );*/


		this.resizeEvent();
	}
}