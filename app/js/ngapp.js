// TODO: Drag & Drop
/*
global angular $ ID3 Materialize ID3Writer saveAs
*/
'use strict';
var app = angular.module('myApp', []);
var musicPosition = null;
var songFile = null;

$('.modal-trigger').leanModal();
$(".button-collapse").sideNav();

app.controller('musicCtrl', [
    '$scope',
    function($scope) {
        $scope.app = {
            name: 'App name',
            version: '1.0'
        };
        $('#file').change(function() {
            var file = this.files[0],
                url = file.urn || file.name;

            ID3.loadTags(url, function() {
                $scope.showTags(url);
            }, {
                tags: ["artist", "title", "album", "year", "track", "genre", "lyrics", "picture"],
                dataReader: ID3.FileAPIReader(file)
            });
        });
        $scope.play = false;
        $scope.songVol = 10;
        $scope.song = {};

        $scope.audioActions = function() {
            if ($scope.play) {
                document.getElementById('playMusic').play();
                musicPosition = setInterval(function() {
                    currentTime();
                }, 1000);
            }
            else {
                document.getElementById('playMusic').pause();
                clearInterval(musicPosition);
            }
        };
        $scope.changeVol = function(dir) {
            var changeTo = 0;
            $scope.songVol = parseInt($scope.songVol, 10);
            if ($scope.songVol > 0 && $scope.songVol < 10) {
                if (dir === 'up') {
                    $scope.songVol += 1;
                }
                else if (dir === 'down') {
                    $scope.songVol -= 1;
                }
                changeTo = $scope.songVol / 10;
            }
            else if ($scope.songVol == 0) {
                if (dir === 'up') {
                    $scope.songVol += 1;
                    changeTo = $scope.songVol / 10;
                }
                else if (dir === undefined) {
                    changeTo = 0;
                }
            }
            else if ($scope.songVol) {
                if (dir === 'down') {
                    if ($scope.songVol > 0) {
                        $scope.songVol -= 1;
                        changeTo = $scope.songVol / 10;
                    }
                }
                else {
                    changeTo = 1;
                }
            }
            document.getElementById('playMusic').volume = changeTo;
        };
        $scope.showTags = function(url) {
            $scope.play = false;
            var tags = ID3.getAllTags(url);

            $scope.song['title'] = tags.title ? tags.title : '';
            $scope.song['artist'] = tags.artist ? tags.artist : '';
            $scope.song['album'] = tags.album ? tags.album : '';
            $scope.song['year'] = tags.year ? tags.year : '';
            $scope.song['track'] = tags.track ? tags.track : '';
            $scope.song['genre'] = tags.genre ? tags.genre : '';
            $scope.song['lyrics'] = tags.lyrics ? tags.lyrics.U : "";

            var image = tags.picture;
            document.getElementById('coverShow').setAttribute('src', '');
            if (image) {
                var base64String = "";
                for (var i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
                document.getElementById('coverShow').setAttribute('src', base64);
            }
            setTimeout(function() {
                Materialize.updateTextFields();
            }, 50);
            $scope.$apply();
        };
        $scope.save = function(songReader, coverReader) {
            var writer = new ID3Writer(songReader.result);
            writer.setFrame('TIT2', $scope.song['title']).setFrame('TPE1', $scope.song['artist'].split(',')).setFrame('TALB', $scope.song['album']).setFrame('TYER', $scope.song['year']).setFrame('TRCK', $scope.song['track']).setFrame('TCON', $scope.song['genre'].split(',')).setFrame('USLT', $scope.song['lyrics']);

            if (coverReader) {
                writer.setFrame('APIC', coverReader.result);
            }

            writer.addTag();
            saveAs(writer.getBlob(), songFile + '_tag.mp3');
        };
        $scope.write = function() {
            var songReader = new FileReader();
            songReader.onload = function() {
                if (document.getElementById('cover').files.length > 0) {
                    var coverReader = new FileReader();
                    coverReader.onload = function() {
                        $scope.save(songReader, coverReader);
                    };
                    coverReader.onerror = function() {
                        console.log('Cover Reader error', coverReader.error);
                    };
                    coverReader.readAsArrayBuffer(document.getElementById('cover').files[0]);
                }
                else {
                    $scope.save(songReader);
                }
            };
            songReader.onerror = function() {
                console.error('Song Reader error', songReader.error);
            };
            songReader.readAsArrayBuffer(document.getElementById('file').files[0]);
        };
    }
]);

function clearTime() {
    $('.curLen3').css('-webkot-transform', 'rotate(0deg)').css('transform', 'rotate(0deg)');
    $('.curLen4').css('-webkot-transform', 'rotate(0deg)').css('transform', 'rotate(0deg)');
    $('.curLen5').css('-webkot-transform', 'rotate(0deg)').css('transform', 'rotate(0deg)');
}

function currentTime() {
    var pm = document.getElementById('playMusic');
    if (pm.ended) {
        clearInterval(musicPosition);
        clearTime();
    }
    else {
        var rotate = (pm.currentTime / pm.duration) * 360;
        $('.determinate').css('width', (pm.currentTime / pm.duration) * 100 + '%');
        if (rotate < 180) {
            $('.curLen3').css('-webkot-transform', 'rotate(' + rotate + 'deg)').css('transform', 'rotate(' + rotate + 'deg)');
        }
        else {
            rotate -= 180;
            $('.curLen3').css('-webkot-transform', 'rotate(180deg)').css('transform', 'rotate(180deg)');
            $('.curLen4').css('-webkot-transform', 'rotate(180deg)').css('transform', 'rotate(180deg)');
            $('.curLen5').css('-webkot-transform', 'rotate(' + rotate + 'deg)').css('transform', 'rotate(' + rotate + 'deg)');
        }
    }
}

$("#cover").change(function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('coverShow').setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(this.files[0]);
    }
});

$("#file").change(function() {
    if (!this.files.length) {
        return;
    }
    var reader = new FileReader();
    var file = this.files[0];
    reader.onload = function(e) {
        $("#noFile").hide();
        $("#fileOpen").show();
        $("#hasFile").show();
        clearTime();
        document.getElementById('playMusic').pause();
        songFile = file.name.split('.')[0];
        $("#playMusic").prop('src', e.target.result);
    };
    reader.onerror = function() {
        console.error('Song Reader Play error', reader.error);
    };
    reader.readAsDataURL(file);
});
