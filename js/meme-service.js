'use strict';
let imgsAmount = 25;
let gImgs = [];

let gMeme = {
    selectedImgId: 1,
    selectedTxtIdx: 0,
    txts: [{
        line: 'That\'s what she said',
        size: 1.5,
        align: 'center',
        color: 'red'
    }]
}

function init() {
    createImgs();
    renderMemes();
}

function canvasInit() {
    gCanvas = $('#canvas')[0];
    gCtx = gCanvas.getContext('2d');
}

function createImgs() {
    for (var i = 1; i <= imgsAmount; i++) {
        gImgs.push(createImg(i))
    }
}
function createImg(id) {
    return {
        id,
        url: `images/${id}.jpg`,
        keywords: []
    };
}

function getImages() {
    return gImgs;
}
function getImg(idx) {
    return gImgs[idx].url;
}

