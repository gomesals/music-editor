import angular from 'angular';
angular.module('musicApp', []).controller('musicCtrl', musicCtrl);

function musicCtrl() {
	const vm = this;
	vm.change = () => {
		console.log('file changed');
	};
}
musicCtrl.$inject = [];
