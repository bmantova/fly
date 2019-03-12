class RequestController {

	async send() {
		var data = JSON.stringify(this.payload);
		if(this.payload != null){
			var	 resp = await fetch("http://localhost:3000"+this.url,{
				method: this.method,
				body: data,
				mode: 'cors',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
		            "Access-Control-Allow-Origin": "http://localhost:3000"
				},
				credentials: 'include'
			})
		}else{
			var resp = await fetch("http://localhost:3000"+this.url,{
				method: this.method,
				mode: 'cors',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
		            "Access-Control-Allow-Origin": "http://localhost:3000"
				},
				credentials: 'include'
			})
		}
		let result = await resp.json();
		return result;
	}
	constructor(url,method, payload) {
		this.url = url;
		this.method = method;
		this.payload = payload;
	}
}