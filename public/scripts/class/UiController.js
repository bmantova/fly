class UiController {
	constructor() {

	}
	loop() {
		this.setSpeed();
		this.setHeight();
		this.setPlaneRotation();

	}
	setPlaneRotation(){
		const rot = app.getPlaneRotation();
		const div = document.getElementById('under_regime');
		if(rot.x<0){
			const difAngle = Math.PI-Math.abs(rot.x);
			if(difAngle< 5*(Math.PI/8) && difAngle > 3*(Math.PI/8)) div.classList.add('active');
			else div.classList.remove('active');
		}
	}
	setSpeed() {
		document.getElementById('main_plane_speed').innerHTML = Math.round(app.getPlaneSpeed());
	}
	setHeight() {
		document.getElementById('main_plane_height').innerHTML = Math.round(app.getPlaneHeight());
	}
}