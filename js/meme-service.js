'use strict';
let imagesPerPage = 16;
let gImgs = [];
var gCurrPageIdx = 0;
let gMeme = loadFromStorage('gMeme');

function init() {
    createImgs();
    renderMemes();
    if (!gMeme) {
        gMeme = {
            selectedImgId: 1,
            selectedTxtIdx: 0,
            txts: [{
                line: '',
                pos: 'top',
                size: 50,
                align: 'center',
                color: 'white',
                stroke: 'black',
                font: 'Impact'
            }]
        }
        saveToStorage('gMeme', gMeme);
    }
    $('.post-nav').click(function(){
        setCurrPageDiff(+this.dataset.nav)
        renderPost()
    });
}

function canvasInit() {
    createImgs();
    renderMemes();
    gCanvas = $('#canvas')[0];
    gCtx = gCanvas.getContext('2d');
    setImgOnCanvas(gMeme.selectedImgId);
    $('.post-nav').click(function(){
        setCurrPageDiff(+this.dataset.nav)
        renderPost()
    });
}

function createImgs() {
    for (var i = 1; i <= imagesPerPage; i++) {
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

function getImgUrl(idx) {
    return gImgs[idx].url;
}

function addTogMeme(txt, imgId) {
    if (gMeme.txts.length === 0) {
        let newLine = {
            line: '',
            pos: 'top',
            size: 50,
            align: 'center',
            color: 'white',
            stroke: 'black',
            font: Impact
        }
        gMeme.txts.push(newLine);
    }
    gMeme.txts[gMeme.selectedTxtIdx].line = txt;
    saveToStorage('gMeme', gMeme);
}

function getMemeLine() {
    return gMeme.txts[gMeme.selectedTxtIdx];
}

function getMemeImgIdx() {
    return gMeme.selectedImgId;
}

function setgMemeImg(imgId) {
    gMeme.selectedImgId = imgId;
    saveToStorage('gMeme', gMeme);
}


function changeFontSize(elBtn) {
    let memeTxt = gMeme.txts[gMeme.selectedTxtIdx];
    (elBtn.classList[1] === 'plus') ? memeTxt.size += 5: memeTxt.size -= 5;
    saveToStorage('gMeme', gMeme);
    renderCanvas();
}

function changeFontDir(elBtn) {
    let memeDir = gMeme.txts[gMeme.selectedTxtIdx];
    if (elBtn.classList[1] === 'al') memeDir.align = 'left';
    else if (elBtn.classList[1] === 'ar') memeDir.align = 'right';
    else memeDir.align = 'center';
    saveToStorage('gMeme', gMeme);
    renderCanvas();
}

function addTxtLine(elBtn) {
    if (gMeme.txts.length === 3) return;
    gMeme.selectedTxtIdx++;
    let lineIdx = gMeme.selectedTxtIdx;
    let newLine = {
        line: '',
        pos: (lineIdx === 1) ? 'bottom' : 'middle',
        size: 50,
        align: 'center',
        color: 'white'
    }
    gMeme.txts.push(newLine);
    saveToStorage('gMeme', gMeme);
    clearTxtInput();
}

function switchBetweenTxts() {
    let numOfTxtLines = gMeme.txts.length;
    // debuggers
    if (numOfTxtLines <= 1) {
        addSelectedStyle(0);
        renderCanvas();
        return;
    }
    if (gMeme.selectedTxtIdx + 1 === gMeme.txts.length) {
        gMeme.selectedTxtIdx = 0;
        saveToStorage('gMeme', gMeme);
        addSelectedStyle();
        renderCanvas();
    } else {
        gMeme.selectedTxtIdx++;
        addSelectedStyle();
        saveToStorage('gMeme', gMeme);
        renderCanvas();
    }

}

function addSelectedStyle() {

    gIsSelected = true;
    setTimeout(() => {
        gIsSelected = false;
        renderCanvas();
    }, 3000);
}

function onDeleteTxt() {
    if (gMeme.txts.length > 0) {
        gMeme.txts.splice(gMeme.selectedTxtIdx, 1);
        if (gMeme.selectedTxtIdx > 0) gMeme.selectedTxtIdx--;
        saveToStorage('gMeme', gMeme);
        renderCanvas();
        clearTxtInput();
    } else return
}

function changeStrokeColor(color) {
    gMeme.txts[gMeme.selectedTxtIdx].stroke = color.value;
    saveToStorage('gMeme', gMeme);
    renderCanvas();
}

function changeFontColor(color) {
    gMeme.txts[gMeme.selectedTxtIdx].color = color.value;
    saveToStorage('gMeme', gMeme);
    renderCanvas();
}

function setCurrPageDiff(diff) {
    console.log(diff);
    if (!diff) {
        gCurrPageIdx = 0;
        return;
    }
    let idx = gCurrPageIdx + diff;
    if (idx < 0) idx = 0;
    else if (idx === 1) idx  = 0;
    gCurrPageIdx = idx;
}