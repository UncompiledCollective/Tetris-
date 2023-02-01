import { useEffect } from 'react';
import {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'

async function canvasPreview(
    image, canvas, crop,){
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("No 2d context");
    }
    const pixelRatio = window.devicePixelRatio;  
    //canvas.width = Math.floor(crop.width * ScaleX * pixelRatio);
    //canvas.height = Math.floor(crop.height * ScaleY * pixelRatio);
    canvas.width = Math.round(crop.width * image.width / 100);
    canvas.height = Math.round(crop.height * image.height / 100);
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = Math.round(crop.x * image.width/100 * scaleX);
    const cropY = Math.round(crop.y * image.height/ 100 *scaleY);

    ctx.scale(1/scaleX, 1/scaleY);
    ctx.translate(-cropX, -cropY);
    ctx.save()
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )
    ctx.restore()
}

async function canvasPreview100(image, canvas, crop,) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("No 2d context");
    }
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropWidth = crop.width * image.width / 100;

    canvas.width = 100;
    canvas.height = 100;

    const Scale = 100 / cropWidth;
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = Math.round(crop.x * image.width / 100 * scaleX);
    const cropY = Math.round(crop.y * image.height / 100 * scaleY);


    ctx.scale(1 / scaleX, 1 / scaleY);
    ctx.scale(Scale, Scale);
    ctx.translate(-cropX, -cropY);
    ctx.save()
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )
    ctx.restore()
}








function centerAspectCrop(mediaWidth, mediaHeight, aspect,) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 35,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}
const useDebounceEffect = (voidFunction, waitTime, dependancies)=>{
    useEffect(() => {
        const timeout = setTimeout(function () {
            voidFunction.apply(undefined, dependancies)
        }, waitTime)
        return function () {
            clearTimeout(timeout);
        }
    }, dependancies)
}

function canvasToBase64(canvas) {
    let file = canvas.toDataURL("image/jpeg");
    let temp = file.split(","); //splits image file into extension part, and base64 string. 
    let fileType = temp[0].match(/:(.*?);/)[1]; // extension
    console.log(fileType, "logging filetype");
    let bstr = atob(temp[1]); // atob turns a string into bytes file. Voodoo. Don't log it, it's just intelligable noise
    let n = bstr.length; // length of that intelligable string. Because.
    let u8arr = new Uint8Array(n); //makes it into an 8 bit? array. This stinks of C.
    while (n--) { //n-- means until n reaches 0. n is usually a couple thousands.
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "testfile",  { type: fileType });
}

function downloadFile(canvas) {
    var element = document.createElement('a');
    let temp = canvas.toDataURL("image/jpeg")
    element.setAttribute('href', temp);
    element.setAttribute('download', "test.jpg");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
export { centerAspectCrop, canvasPreview, canvasPreview100, canvasToBase64, downloadFile };