import angular from 'angular';
angular.module('musicApp', []).controller('musicCtrl', musicCtrl);

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
		song: {}
	};
	vm.change = () => {
		console.log('file changed');
	};
	vm.volume = up => {
		if (!up && vm.actions.vol > 0) {
			vm.actions.vol -= 1;
		} else if (up && vm.actions.vol < 10) {
			vm.actions.vol += 1;
		}
	}
}
musicCtrl.$inject = [];
