const mainLoopCaller = (elem) =>  {
	elem.mainLoop();
}

class AppController {
	mainLoop() {
		let begin = new Date();
		this.bulletManager.loop();
		if(this.inPlane) {
			this.three.setCameraPosition(this.mainPlane.cameraDistance);
			this.three.setLightPosition(this.mainPlane.position);
		}
		else {
			this.mainSuit.loop();
			this.three.setCameraPosition(this.mainSuit.cameraDistance);
			this.three.setLightPosition(this.mainSuit.position);
		}
		this.mainPlane.loop();
		this.UI.loop();
		for(let aPlane of this.allPlane) {
			if(aPlane) aPlane.loop();
		}
		this.three.render();
		this.t++;
		if(!this.stop) {
			let self = this;
			let end = new Date();
			//res('waitTime',limit(this.timewait - (end - begin),0,this.timewait))
			setTimeout(mainLoopCaller,limit(this.timewait - (end - begin),0,this.timewait),this)
			//setTimeout(function(){self.mainLoop()},0)
		}
	}
	stop() {
		this.stop = true;
	}
	start() {
		this.mainLoop();
	}
	startRequests() {
		//Get my id
		this.socket.emit('getId', 'My id pleaase');
	}
	addScore(n) {
		this.score += n;
		res('score',this.score);
	}
	getScore() { return this.score;} 
	addKill() {
		this.nbKill++;
		res('kills',this.nbKill);
	}
	getKills() { return this.nbKill;}
	addDeath() {
		this.nbDeath++;
		res('death',this.nbDeath);
		this.inPlane = true;
		this.mainSuit.invisible();
		this.three.follow(this.mainPlane);
	}
	getDeath() { return this.nbDeath;}
	init() {
		this.allPlane = [];
		this.t = 0;
		this.three = new ThreeController();
		var plane = this.loader.models['plane2'].children[0].clone();
		let suit = this.loader.models['wingsuit'].children[0].clone();
		this.mainPlane = new MyPlane(plane,new THREE.Vector3(0,100,0), new THREE.Vector3(0,Math.PI,0))
		this.mainSuit = new MyWingsuit(suit,new THREE.Vector3(0,100,0), new THREE.Vector3(0,Math.PI,0))
		this.mainSuit.invisible();
		this.map = new Map()
		this.three.follow(this.mainPlane);
		this.bulletManager = new Bullet(this.mainPlane);
		this.UI = new UiController();
		this.startRequests();
		this.start();
	}
	eject() {
		this.inPlane = false;
		this.mainSuit.ejectFrom(this.mainPlane);
		//this.mainPlane.invisible();
		this.mainSuit.visible();
		this.three.follow(this.mainSuit);
	}
	getPlaneSpeed() {
		return this.mainPlane.speed * (1000/this.timewait) * 7;
	}
	getPlaneHeight() {
		return this.mainPlane.position.y * 4;
	}
	getPlaneRotation() {
		return this.mainPlane.rotation;
	}
	constructor() {
		this.timewait = 30;// ms
		this.score = 0;
		this.nbDeath = 0;
		this.nbKill = 0;
		//this.socket = io.connect('http://192.168.43.107:3000');
		this.socket = io.connect('http://localhost:3000');
		this.loader = new Loader();
		this.inPlane = true;
		this.stop = false;
		var self = this;
		this.loader.loaded(function() {
			self.init();
		});
	}

}