import angular from 'angular';
angular.module('musicApp', []).controller('musicCtrl', musicCtrl);
let position;
let songFile;

function musicCtrl() {
	const vm = this;
	vm.song = {
		artist: 'Stone Sour',
		title: 'Miracles',
		album: 'Audio Secrecy',
		year: '2010',
		track: '10',
		genre: 'Alternative Metal',
		lyrics: '',
	};
	vm.actions = {
		play: false,
		vol: 10,
		hasFile: false,
		song: {}
	};
	vm.change = (inputFile) => {
		console.log('file changed');
		if (!inputFile.files.length) return false;
		const reader = new FileReader();
		const file = inputFile.files[0];
		// TODO: change actions.hasFile to true, actions.play to false;
		clearInterval(position);
		clearTime();
		vm.actions.play = false;
		document.getElementById('play').pause();
		reader.onload = e => {
			vm.actions.hasFile = true;
			songFile = file.name.split('.')[0];
			document.getElementById('play').setAttribute('src', e.target.result);
		};
		reader.onerror = () => {
			vm.actions.hasFile = false;
			alert('Song Reader play error');
			console.log(reader.error);
		};
		reader.readAsDataURL(file);
	};
	vm.playPause = () => {
		if (vm.actions.play) {
			document.getElementById('play').pause();
			clearInterval(position);
		} else {
			document.getElementById('play').play();
			position = setInterval(currentTime, 1000);
		}
		vm.actions.play = !vm.actions.play;
	}
	vm.volume = up => {
		if (!up && vm.actions.vol > 0) {
			vm.actions.vol -= 1;
		} else if (up && vm.actions.vol < 10) {
			vm.actions.vol += 1;
		}
		document.getElementById('play').volume = (vm.actions.vol > 0 ? vm.actions.vol / 10 : 0);
	}
}

function currentTime() {
	console.log('currentTime');
}

function clearTime() {
	console.log('clearTime');
}
musicCtrl.$inject = [];
