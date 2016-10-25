'use strict';

const expect = require('chai').expect
    , id3 = require('./app/src/id3');

describe('ID3', () => {
    describe('read', () => {
        it('should return the id3 tags', () => {
            var res = id3.read('./sample/Miracles.mp3');
            expect(res).to.be.a.object;
            expect(res.album).to.be.equal('Audio Secrecy');
            expect(res.genre).to.be.equal('Alternative Metal');
            expect(res.title).to.be.equal('Miracles');
            expect(res.artist).to.be.equal('Stone Sour');
            expect(res.performerInfo).to.be.equal('Stone Sour');
            expect(res.publisher).to.be.equal('Roadrunner Records');
            expect(res.trackNumber).to.be.equal('10');
            expect(res.year).to.be.equal('2010');
        });
    });
});
