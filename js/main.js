'use strict';

let gCanvas;
let gCtx;
let gIsSelected = false;

function renderMemes() {
    let images = getImages();
    let idxPage = getgCurrPageIdx();
    let strHTMLs = '';
    let i = (idxPage===0)?0:17;
    let length =(idxPage===0)?16:images.length;
    for (i ; i <length; i++) {
        strHTMLs+=`<img src="${images[i].url}" class="image-item" onclick="onImgClick(${images[i].id})">`;
    }
    $('div.images').html(strHTMLs);
}

function onImgClick(idx) {
    setgMemeImg(idx);
    window.location.assign("editor.html");
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
function renderCanvas() {
    let img = new Image();
    img.src = getImgUrl(getMemeImgIdx() - 1);
    // gCanvas.width = img.width;
    // gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    let gMemeCopy = loadFromStorage('gMeme');
    let memeTxt = loadFromStorage('gMeme').txts;
    let xPos;
    memeTxt.map(txt => {
        gCtx.textAlign = txt.align;
        gCtx.fillStyle = txt.color;
        gCtx.strokeStyle = txt.stroke;
        gCtx.font = txt.size + 'px ' + txt.font;
        gCtx.lineWidth = 2;
        if (txt.align === 'left') xPos = 10;
        else if (txt.align === 'right') xPos = 540;
        else xPos = gCanvas.width / 2;
        switch (txt.pos) {
            case 'top':
                gCtx.fillText(txt.line, xPos, 70);
                gCtx.strokeText(txt.line, xPos, 70);
                break;
            case 'middle':
                gCtx.fillText(txt.line, xPos, gCanvas.height / 2);
                gCtx.strokeText(txt.line, xPos, gCanvas.height / 2);
                break;
            case 'bottom':
                gCtx.fillText(txt.line, xPos, 500);
                gCtx.strokeText(txt.line, xPos, 500);
                break;
            default:
                break;
        }
        if (gIsSelected && txt.line === gMemeCopy.txts[gMemeCopy.selectedTxtIdx].line) {
            let lineHeight = txt.size;
            let textWidth = gCtx.measureText(txt.line).width;
            switch (txt.pos) {
                case 'top':
                    gCtx.strokeRect(gCanvas.width / 2 - textWidth / 2, 30, textWidth, lineHeight);
                    break;
                case 'middle':
                    gCtx.strokeRect(gCanvas.width / 2 - textWidth / 2, 235, textWidth, lineHeight);
                    break;
                case 'bottom':
                    gCtx.strokeRect(gCanvas.width / 2 - textWidth / 2, 510 - lineHeight, textWidth, lineHeight);
                    break;
                default:
                    break;
            }
        }
    })
}

function clearTxtInput() {
    $('.txt-input').val('');
}
function toggleMenu() {
    var $elMainMenu = $('#mainMenu');
    $elMainMenu.toggleClass('open');
}