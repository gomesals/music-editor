const fs = require('fs');

var exports = module.exports = {};

var TIF = { //All text information frames
    album: "TALB",
    bpm: "TBPM",
    composer: "TCOM",
    genre: "TCON",
    copyright: "TCOP",
    date: "TDAT",
    playlistDelay: "TDLY",
    encodedBy: "TENC",
    textWriter: "TEXT",
    fileType: "TFLT",
    time: "TIME",
    contentGroup: "TIT1",
    title: "TIT2",
    subtitle: "TIT3",
    initialKey: "TKEY",
    language: "TLAN",
    length: "TLEN",
    mediaType: "TMED",
    originalTitle: "TOAL",
    originalFilename: "TOFN",
    originalTextwriter: "TOLY",
    originalArtist: "TOPE",
    originalYear: "TORY",
    fileOwner: "TOWN",
    artist: "TPE1",
    performerInfo: "TPE2",
    conductor: "TPE3",
    remixArtist: "TPE4",
    partOfSet: "TPOS",
    publisher: "TPUB",
    trackNumber: "TRCK",
    recordingDates: "TRDA",
    internetRadioName: "TRSN",
    internetRadioOwner: "TRSO",
    size: "TSIZ",
    ISRC: "TSRC",
    encodingTechnology: "TSSE",
    year: "TYER"
}

exports.read = function(filebuffer) {
    const filePath = filebuffer;
    if (typeof filebuffer === "string" || filebuffer instanceof String)
        filebuffer = fs.readFileSync(filebuffer);

    let header = new Buffer(10);
    filebuffer.copy(header, 0, getID3Start(filebuffer));

    let frameSize = getFrameSize(header),
        ID3Frame = new Buffer(frameSize + 1);

    filebuffer.copy(ID3Frame, 0, getID3Start(filebuffer));

    let tags = {},
        frames = Object.keys(TIF);

    for (var i = 0; i < frames.length; ++i) {
        var frameStart = ID3Frame.indexOf(TIF[frames[i]]);
        if (frameStart == -1) {
            continue;
        }

        frameSize = decodeSize(new Buffer([
            ID3Frame[frameStart + 4],
            ID3Frame[frameStart + 5],
            ID3Frame[frameStart + 6],
            ID3Frame[frameStart + 7]
        ]));
        let offset = 1;

        if (ID3Frame[frameStart + 11] == 0xFF || ID3Frame[frameStart + 12] == 0xFE) {
            offset = 3;
        }
        let frame = new Buffer(frameSize - offset);
        ID3Frame.copy(frame, 0, frameStart + 10 + offset);

        tags[frames[i]] = frame.toString('utf8').replace(/\0/g, '');
    }
    if (ID3Frame.indexOf("APIC")) {
        var picture = {};
        var APICFrameStart = ID3Frame.indexOf("APIC");
        var APICFrameSize = decodeSize(new Buffer([
            ID3Frame[APICFrameStart + 4],
            ID3Frame[APICFrameStart + 5],
            ID3Frame[APICFrameStart + 6],
            ID3Frame[APICFrameStart + 7]
        ]));
        var APICFrame = new Buffer(APICFrameSize);
        ID3Frame.copy(APICFrame, 0, frameStart + 10);
        if (APICFrame.indexOf("image/jpeg")) {
            picture.mime = "jpeg";
        } else if (APICFrame.indexOf("image/png")) {
            picture.mime = "png";
        }
    }
    return tags;
}

function getFrameSize(buffer) {
    return decodeSize(new Buffer([buffer[6], buffer[7], buffer[8], buffer[9]]));
}

function encodeSize(totalSize) {
    let byte_3 = totalSize & 0x7F,
        byte_2 = (totalSize >> 7) & 0x7F,
        byte_1 = (totalSize >> 14) & 0x7F,
        byte_0 = (totalSize >> 21) & 0x7F;
    return ([byte_0, byte_1, byte_2, byte_3]);
}

function decodeSize(hSize) {
    return ((hSize[0] << 21) + (hSize[1] << 14) + (hSize[2] << 7) + (hSize[3]));
}

function getID3Start(buffer) {
    let tagStart = buffer.indexOf("ID3"),
        musicStart = buffer.indexOf('' + 0xFFFB30);
    if (tagStart > musicStart) {
        return tagStart;
    }
    return -1;
}
