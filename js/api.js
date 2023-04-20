import { mixBuffers, concatenateTwoBuffers, slice } from "./audio.js";

const API = {
    slice:(context, buffer, begin, end) => slice(context, buffer, begin, end),
    sliceInHalf: (context, buffer, length) => [slice(context, buffer, 0, length), slice(context, buffer, length + 0.00001, buffer.length/1000)],
    concatenateBuffers: (context, ...buffers) => {
        if (buffers.length < 2) {
            console.log("need more than 1 buffer!");
            return null;
        }  
    
        let temp = buffers[0];
    
        if (buffers.length > 2)
            for (let i = 1; i < buffers.length - 1; i++) {
                let concat = concatenateTwoBuffers(context, temp, buffers[i + 1]);
                if (!concat) return null;
            }
        else temp = concatenateTwoBuffers(context, temp, buffers[1]);
    
        return temp;
    },
    mixBuffers: (context, ...buffers) => mixBuffers(context, ...buffers)
}

export { API as Audio };