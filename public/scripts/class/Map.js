class Map {
	constructor() {
		this.model = app.loader.models['newMap'];
		
		this.addSea();
		for(let i = 0; i< this.model.children.length;i++){
			this.model.children[i].castShadow = true;

			this.model.children[i].receiveShadow = true;
		}
		app.mainPlane.addCollider(this.model);
		this.model.receiveShadow = true;
		app.three.addObject(this.model);
	}
	addSea()
	{
		let geometry = new THREE.PlaneGeometry( 1000, 1000);
		geometry.rotateX(-Math.PI/2);
		let material = new THREE.MeshPhongMaterial({
			shininess: 50,
            color: 0x009bff
        })
		var plane = new THREE.Mesh( geometry, material );
		this.model.add( plane );
	}
}