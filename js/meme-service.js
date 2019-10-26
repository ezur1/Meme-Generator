'use strict';
let imagesPerPage = 16;
let gImgs = [];
var gCurrPageIdx = 0;
let gMeme = loadFromStorage('gMeme');
let isEditorPage = false;
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
        saveToStorage('pageIdx', gCurrPageIdx);
    }
    $('.post-nav').click(function(){
        setCurrPageDiff(+this.dataset.nav)
        renderMemes();
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
        renderMemes();
    });
    isEditorPage=true;
}

function createImgs() {
    for (var i = 1; i <= 25; i++) {
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
            font: 'Impact'
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

function getgCurrPageIdx(){
    return gCurrPageIdx;
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
        color: 'white',
        font: 'Impact'
    }
    gMeme.txts.push(newLine);
    saveToStorage('gMeme', gMeme);
    clearTxtInput();
}

function switchBetweenTxts() {
    let numOfTxtLines = gMeme.txts.length;
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

function onChangeFont(font){
    if(gMeme.txts[gMeme.selectedTxtIdx].line==="")return;
    gMeme.txts[gMeme.selectedTxtIdx].font = font;
    saveToStorage('gMeme', gMeme);
    renderCanvas();
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
    if (!diff) {
        gCurrPageIdx = 0;
        return;
    }
    let idx = gCurrPageIdx + diff;
    if (idx < 0) idx = 0;
    else if (idx > 1 && !isEditorPage) idx  = 0;
    else if(isEditorPage && idx>5)idx  = 0;
    gCurrPageIdx = idx;
    saveToStorage('pageIdx', gCurrPageIdx);
}

// share


// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();

    document.getElementById('imgData').value = canvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('http://ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function (response) {
            return response.text()
        })

        .then(onSuccess)
        .catch(function (error) {
            console.error(error)
        })
}


// save

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    console.log(data);
    elLink.href = data;
    elLink.download = 'my-img.jpg';
    console.log(elLink.download);
}
