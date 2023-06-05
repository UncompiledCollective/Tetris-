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


export { centerAspectCrop, canvasPreview, canvasPreview100 };