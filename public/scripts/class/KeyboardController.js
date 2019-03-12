class KeyboardController {
	keyDownEvent() {
		var self = this;
		window.addEventListener('keydown',function(e){
			self.pressed[e.keyCode] = true;
		},false);
	}
	keyUpEvent() {
		var self = this;
		window.addEventListener('keyup',function(e){
			self.pressed[e.keyCode] = false;
		},false);
	}
	isPressed(keycode){
		if(typeof keycode == 'string') return this.pressed[KeyboardController.KEY[keycode]];
		return this.pressed[keycode];
	}
	constructor()
	{
		this.pressed = [];
		this.keyUpEvent();
		this.keyDownEvent();
	}
}
var keyboard = new KeyboardController();
KeyboardController.KEY = {
	'UP':38,
	'DOWN':40,
	'LEFT':37,
	'RIGHT':39,
	'SPACE':32,
	'Z':90,
	'Q':81,
	'S':83,
	'D':68,
	'A':65,
	'0':96,
	'C':67,
	'E':69
}