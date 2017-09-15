import angular from 'angular';
angular.module('musicApp', []).controller('musicCtrl', musicCtrl);
let position;
let songFile;

function musicCtrl($scope) {
	const vm = this;
	vm.song = {
		artist: '',
		title: '',
		album: '',
		year: '',
		track: '',
		genre: '',
		lyrics: '',
	};
	vm.actions = {
		play: false,
		vol: 10,
		hasFile: true, // TOOD: change
	};
	vm.change = inputFile => {
		if (!inputFile.files.length) return false;
		const reader = new FileReader();
		const file = inputFile.files[0];
		const url = file.urn || file.name;
		clearInterval(position);
		vm.clearTime();
		vm.actions.play = false;
		$scope.$apply();
		document.getElementById('play').pause();
		reader.onload = e => {
			songFile = file.name.split('.')[0];
			document.getElementById('play').setAttribute('src', e.target.result);
			vm.getTags(url, file);
		};
		reader.onerror = () => {
			vm.actions.hasFile = false;
			$scope.$apply();
			alert('Error playing the file.');
			console.log(reader.error);
		};
		reader.readAsDataURL(file);
	};
	vm.getTags = (url, file) => {
		ID3.loadTags(url, () => {
			const tags = ID3.getAllTags(url);
			vm.song = {
				artist: tags.artist ? tags.artist : '',
				title: tags.title ? tags.title : '',
				album: tags.album ? tags.album : '',
				year: tags.year ? tags.year : '',
				track: tags.track ? tags.track : '',
				genre: tags.genre ? tags.genre : '',
				lyrics: tags.lyrics ? tags.lyrics.U : '',
			};
			document.getElementById('spic').style.backgroundImage = 'unset';
			if (tags.picture) {
				let base64String = '';
				for (let i = 0; i < tags.picture.data.length; i++) {
					base64String += String.fromCharCode(tags.picture.data[i]);
				}
				const base64 = `data:${tags.picture.format};base64,${window.btoa(base64String)}`;
				document.getElementById('spic').style.backgroundImage = `url('${base64}')`;
			}
			vm.actions.hasFile = true;
			$scope.$apply();
		}, {
			tags: ["artist", "title", "album", "year", "track", "genre", "lyrics", "picture"],
			dataReader: ID3.FileAPIReader(file)
		});
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
	};
	vm.volume = up => {
		if (!up && vm.actions.vol > 0) {
			vm.actions.vol -= 1;
		} else if (up && vm.actions.vol < 10) {
			vm.actions.vol += 1;
		}
		document.getElementById('play').volume = (vm.actions.vol > 0 ? vm.actions.vol / 10 : 0);
	};
	vm.openCover = () => {
		document.getElementById('lblCover').click();
	};
	vm.changeCover = file => {
		if (file.files && file.files[0]) {
			const reader = new FileReader();
			reader.onload = e => {
				document.getElementById('spic').style.backgroundImage = `url('${e.target.result}')`;
			}
			reader.readAsDataURL(file.files[0]);
		}
	};
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
