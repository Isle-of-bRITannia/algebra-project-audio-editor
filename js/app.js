import { Audio } from "./api.js";

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sampleCounts = 4;
let buffers = [];
let audioSrc = [];
for (let i = 0; i < sampleCounts; i++) {
    buffers.push(audioContext.createBufferSource());
    audioSrc.push(`audio/sample${i+1}.wav`);
}

const audioData1 = await fetchAudio(audioSrc[0]);
const audioData2 = await fetchAudio(audioSrc[1]);
const audioData3 = await fetchAudio(audioSrc[2]);
const audioData4 = await fetchAudio(audioSrc[3]);

audioContext.decodeAudioData(audioData1, function(buffer){
    buffers[0].buffer = buffer;
}, onDecodeError);
audioContext.decodeAudioData(audioData2, function(buffer){
    buffers[1].buffer = buffer;
}, onDecodeError);
audioContext.decodeAudioData(audioData3, function(buffer){
    buffers[2].buffer = buffer;
}, onDecodeError);
audioContext.decodeAudioData(audioData4, function(buffer){
    buffers[3].buffer = buffer;
}, onDecodeError);


document.querySelector(".merge").addEventListener("click", () => {
    let merge = Audio.concatenateBuffers(audioContext, buffers[0].buffer, buffers[1].buffer);
    playBuffer(merge);
});

document.querySelector(".cut").addEventListener("click", () => {
    let cut = Audio.slice(audioContext, buffers[0].buffer, 0, 500); 
    playBuffer(cut);
});

document.querySelector(".mix").addEventListener("click", () => {
    let mix = Audio.mixBuffers(audioContext, buffers[2].buffer, Audio.concatenateBuffers(audioContext, buffers[0].buffer, buffers[1].buffer));
    playBuffer(mix);
});

document.querySelector(".slice").addEventListener("click", () => {
    let concat = Audio.concatenateBuffers(audioContext, buffers[0].buffer, buffers[1].buffer);
    let slice = Audio.sliceInHalf(audioContext, concat, concat.length/2000);
    let minorMix = Audio.mixBuffers(audioContext, slice[1], buffers[3].buffer);
    let concat2 = Audio.concatenateBuffers(audioContext, slice[0], minorMix);
    let mix = Audio.mixBuffers(audioContext, buffers[2].buffer, concat2);
    playBuffer(mix);
});

function playBuffer(buffer){
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
}

// Credits: https://stackoverflow.com/questions/46856331/web-audio-api-get-audiobuffer-of-audio-element
function fetchAudio(url){
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => resolve(request.response);
        request.onerror = (e) => reject(e);
        request.send();
    });
}

function onDecodeError(e){
  console.log("Error decoding buffer: " + e.message);
  console.log(e);
}
