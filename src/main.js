import data from './out.json'


window.random = function () {
	let selection = data[uniformRandNumber(data.length)];
	console.log(selection);
	document.getElementById("title").innerText = selection.title;
	document.getElementById("title").setAttribute("href", selection.url);
}

window.lucky = function () {
	let selection = data[uniformRandNumber(data.length)];
	document.location.href = selection.url;
}

function uniformRandNumber(range) {
	var max = Math.floor(2**32/range) * range; // make "max" a multiple of "range"
	do {
			var x = Math.floor(Math.random() * 2**32); // pick a number of [0, 2^32).
	} while(x >= max); // try again if x is too big
	return(x % range); // uniformly picked in [0, range)
}