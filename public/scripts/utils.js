function limit(v,a,b) {
	if(v < a) return a;
	if(v > b) return b;
	return v;
}
function res(name,value) {
	className = name.replace(' ','_');
	let r = document.getElementById('res')
	if(r.getElementsByClassName(className).length > 0) r.getElementsByClassName(className)[0].innerHTML = '<span class="res_title">'+name+'</span> <span class="res_content">'+value+'</span>';
	else r.innerHTML += '<div class="'+className+'"><span class="res_title">'+name+'</span> = <span class="res_content">'+value+'</span></div>';
}
function virg(val,n=1)
{
	var exp = Math.pow(10,Math.floor(n));
	return Math.round(val*exp)/exp;
}
function randfloat(a,b) {
	return Math.random()*(b-a)+a;
}