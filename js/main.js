'use strict';

let gCanvas;
let gCtx;

function renderMemes() {
    var images = getImages();
    var strHTMLs = images.map(function (img) {
        return `<img src="${img.url}" class="image-item" onclick="onImgClick(${img.id})">`;
    });
    $('div.images').html(strHTMLs.join(''));
}

function onImgClick(idx) {
    console.log(idx);
    $('.header-title').css('display', 'none');
    $('.images-wrapper').css('height', '20vh');
    $('.images-wrapper').css('grid-template-rows', '1fr');
    $('.editor-container').css('display', 'flex');
    canvasInit();
    let img = new Image();
    img.src = getImg(idx-1);
    img.onload = () => {
        gCtx.drawImage(img, 0, 0,gCanvas.width,gCanvas.height);
    };
}