import angular from 'angular';
angular.module('musicApp', []).controller('musicCtrl', musicCtrl);
let position;
let songFile;

function musicCtrl($scope) {
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
		clearInterval(position);
		vm.clearTime();
		vm.actions.play = false;
		$scope.$apply();
		document.getElementById('play').pause();
		reader.onload = e => {
			vm.actions.hasFile = true;
			$scope.$apply();
			songFile = file.name.split('.')[0];
			document.getElementById('play').setAttribute('src', e.target.result);
		};
		reader.onerror = () => {
			vm.actions.hasFile = false;
			$scope.$apply();
			alert('Error playing the file.');
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
			position = setInterval(vm.currentTime, 1000);
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
	vm.currentTime = () => {
		const play = document.getElementById('play');
		if (play.ended) {
			clearInterval(position);
			vm.clearTime();
			vm.actions.play = false;
			$scope.$apply();
		} else {
			const percent = Math.round((play.currentTime / play.duration) * 100);
			document.getElementById('crlt').style.borderImage = `linear-gradient(90deg, #f76707 ${percent}%, transparent 0%) 1`;
		}
	};
	vm.clearTime = () => {
		document.getElementById('crlt').style.borderImage = `linear-gradient(90deg, #f76707 0%, transparent 0%) 1`;
	};
}
musicCtrl.$inject = ['$scope'];
