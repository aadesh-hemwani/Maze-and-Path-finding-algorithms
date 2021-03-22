import {wall} from './colors.js'
import {wallAnimation} from './animation.js'


const block_border = ".2px solid rgba(15, 15, 15, 0.2)";

export async function delay(time) {
    await new Promise(resolve => {
        setTimeout(() => resolve(), time);
    });
}

export function makeWall (cBlock){
    cBlock.animate(wallAnimation, 500 );
    cBlock.style.backgroundColor = wall;
    cBlock.style.border = "none";
}

export function breakWall(cBlock){
    cBlock.animate(wallAnimation, {duration: 500, direction:"reverse"});
    cBlock.style.backgroundColor = "white";
    // cBlock.style.border = block_border;
}

export function buildWall(node){
    if(node.style.backgroundColor === wall){
        breakWall(node);
    }else{
        makeWall(node);
    }
}

export function clearCanvas(blocks){
    const rows = blocks.length;
    const cols = blocks[0].childElementCount;
    
    for(let i=1; i<rows-1; i++){
        for(let j=1;  j<cols-1; ++j){
            blocks[i].childNodes[j].style.backgroundColor = "white";
            blocks[i].childNodes[j].innerHTML = "";
            blocks[i].childNodes[j].style.borderRadius = "0px";
            
            // blocks[i].childNodes[j].style.border = block_border;
        }
    }
}
