'use strict';

let gCanvas;
let gCtx;
let gIsSelected = false;

function renderMemes() {
    let images = getImages();
    let idxPage = getgCurrPageIdx();
    let strHTMLs = '';
    let i = 1;
    let length;
    if ($('section').hasClass('editor-pics')) {
        i = 4 * idxPage;
        length = 4 * (idxPage + 1);
    } else {
        i = (idxPage === 0) ? 0 : 17;
        length = (idxPage === 0) ? 16 : images.length;
    }

    for (i; i < length; i++) {
        strHTMLs += `<img src="${images[i].url}" class="image-item" onclick="onImgClick(${images[i].id})">`;
    }
    $('div.images').html(strHTMLs);
}

function renderCanvas() {
    let img = new Image();
    img.src = getImgUrl(getMemeImgIdx() - 1);
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    let gMemeCopy = loadFromStorage('gMeme');
    let memeTxts = gMemeCopy.txts;
    memeTxts.map((txt) => {
        gCtx.textAlign = txt.align;
        gCtx.fillStyle = txt.color;
        gCtx.strokeStyle = txt.stroke;
        gCtx.font = txt.size + 'px ' + txt.font;
        gCtx.lineWidth = 2;
        setXpos(txt.align, txt);
        switch (txt.pos) {
            case 'top':
                txt.yPos.yStart = 70;
                break;
            case 'middle':
                txt.yPos.yStart = gCanvas.height / 2;
                break;
            case 'bottom':
                txt.yPos.yStart = 500;
                break;
            default:
                break;
        }
        gCtx.fillText(txt.line, txt.xPos.xStart, txt.yPos.yStart);
        gCtx.strokeText(txt.line, txt.xPos.xStart, txt.yPos.yStart);
        let lineHeight = txt.size;
        let textWidth = gCtx.measureText(txt.line).width;
        txt.xPos.xStart = gCanvas.width / 2 - textWidth / 2;
        txt.xPos.xEnd = textWidth;
        txt.yPos.yEnd = lineHeight;
        if (gIsSelected && txt.line === gMemeCopy.txts[gMemeCopy.selectedTxtIdx].line) {
            switch (txt.pos) {
                case 'top':
                    txt.yPos.yStart = 30;
                    break;
                case 'middle':
                    txt.yPos.yStart = 235;
                    break;
                case 'bottom':
                    txt.yPos.yStart = 510 - lineHeight;
                    break;
                default:
                    break;
            }
            gCtx.strokeRect(txt.xPos.xStart, txt.yPos.yStart, txt.xPos.xEnd, txt.yPos.yEnd);
        }
    })
    saveToStorage('gMeme', gMemeCopy);
}

function setgMemeImg(imgId) {
    gMeme.selectedImgId = imgId;
    saveToStorage('gMeme', gMeme);
}

function setImgOnCanvas(idx) {
    let img = new Image();
    img.src = getImgUrl(idx - 1);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        renderCanvas();
    };
}

function onAddTxt(txt) {
    addTogMeme(txt);
    renderCanvas();
}


function clearTxtInput() {
    $('.txt-input').val('');
}

function toggleMenu() {
    var $elMainMenu = $('#mainMenu');
    $elMainMenu.toggleClass('open');
}

function setXpos(pos, txt) {
    if (pos === 'left') txt.xPos.xStart = 10;
    else if (pos === 'right') txt.xPos.xStart = 540;
    else txt.xPos.xStart = gCanvas.width / 2;
}


function canvasClicked(ev) {
    let txtIdx;
    let gMemeCopy = loadFromStorage('gMeme');
    let txt = gMemeCopy.txts.find((txt,idx) => {
        txtIdx = idx;
      return(
        ev.offsetX > txt.xPos.xStart &&
        ev.offsetX <  txt.xPos.xEnd +txt.xPos.xStart&&
        ev.offsetY < txt.yPos.yStart &&
        ev.offsetY > txt.yPos.yEnd
      )
    })
    if(txt){
        gMemeCopy.selectedTxtIdx = txtIdx;
        saveToStorage('gMeme',gMemeCopy);
        addSelectedStyle();
        renderCanvas();
    }
  }