'use strict';

var app = angular.module('myApp', []);
var musicPosition = null;
var fullSongPath = null;
var name = 'alexandre';

$('.modal-trigger').leanModal();
$(".button-collapse").sideNav();

$(".openAudio").click(function() {
    chrome.fileSystem.chooseEntry({
        type: 'openFile',
        accepts: [
            {
                description: 'MP3 files (*.mp3)',
                extensions: ['mp3']
            }
        ]
    }, function(fileEntry) {
        if (!fileEntry) {
            $("#res").html('nada');
            return;
        }
        $("#noFile").hide();
        $("#fileOpen").show();
        $("#hasFile").show();
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var scope = $("#fileOpen").scope();
                scope.$apply(function() {
                    scope.play = false;
                });
                clearTime();
                document.getElementById('playMusic').pause();
                $("#playMusic").prop('src', e.target.result);
            };
            reader.readAsDataURL(file);
        });
    });
});

app.controller('musicCtrl', [
    '$scope', '$sce',
    // '$scope',
    function($scope, $sce) {
        $scope.play = false;
        $scope.songVol = 10;
        // $scope.songPath = $sce.trustAsResourceUrl('sample/Miracles.mp3');
        $scope.song = {
            title: 'Musica',
            artist: 'Cantor',
            albumArtist: 'cantor legal',
            album: 'Album',
            year: '2016',
            track: '3',
            genre: 'genero 1',
            lyrics: 'Letra maneira da musica',
            comment: 'Comentarios'
        };

        $scope.audioActions = function() {
            if ($scope.play) {
                document.getElementById('playMusic').play();
                musicPosition = setInterval(function() {
                    currentTime()
                }, 1000);
            } else {
                document.getElementById('playMusic').pause();
                clearInterval(musicPosition);
            }
        }
        $scope.changeVol = function(dir) {
            var changeTo = 0;
            $scope.songVol = parseInt($scope.songVol);
            if ($scope.songVol > 0 && $scope.songVol < 10) {
                if (dir === 'up') {
                    $scope.songVol += 1;
                } else if (dir === 'down') {
                    $scope.songVol -= 1;
                }
                changeTo = $scope.songVol / 10;
            } else if ($scope.songVol == 0) {
                if (dir === 'up') {
                    $scope.songVol += 1;
                    changeTo = $scope.songVol / 10;
                } else if (dir === undefined) {
                    changeTo = 0;
                }
            } else if ($scope.songVol) {
                if (dir === 'down') {
                    if ($scope.songVol > 0) {
                        $scope.songVol -= 1;
                        changeTo = $scope.songVol / 10;
                    }
                } else {
                    changeTo = 1;
                }
            }
            document.getElementById('playMusic').volume = changeTo;
        }
    }
]);

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#coverShow').attr('src', e.target.result);
            console.log('cheguei');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

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
    } else {
        var end = moment.duration(pm.duration * 1000).format('mm:ss');
        var cur = moment.duration(pm.currentTime * 1000).format('mm:ss');
        var rotate = (pm.currentTime / pm.duration) * 360;
        $('.curLen1').prop('title', cur + ' - ' + end);
        $('.determinate').css('width', (pm.currentTime / pm.duration) * 100 + '%');
        if (rotate < 180) {
            $('.curLen3').css('-webkot-transform', 'rotate(' + rotate + 'deg)').css('transform', 'rotate(' + rotate + 'deg)');
        } else {
            rotate -= 180;
            $('.curLen3').css('-webkot-transform', 'rotate(180deg)').css('transform', 'rotate(180deg)');
            $('.curLen4').css('-webkot-transform', 'rotate(180deg)').css('transform', 'rotate(180deg)');
            $('.curLen5').css('-webkot-transform', 'rotate(' + rotate + 'deg)').css('transform', 'rotate(' + rotate + 'deg)');
        }
    }
}

$("#cover").change(function() {
    console.log('foi');
    readURL(this);
});
