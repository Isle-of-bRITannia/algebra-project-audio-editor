let audio1 = document.querySelector('.audio1');
let audio2 = document.querySelector('.audio2');
let audio3 = document.querySelector('.audio3');
let audioContext;
let ab1, ab2, resultNode;

const pipe2 = (f, g) => (...args) => g(f(...args));
const pipe = (...fs) => fs.reduce(pipe2);

const Merge = (context, ...audios) => {
    console.log(audios);
    let path = context.createMediaStreamDestination();
    audios.map(a => a.connect(path));
    return path;
};

//const AddOffset = (context, channel, length, audio) => Merge(context, Buffer(context, channel, length), audio);
const AddOffset = (context, channel, length, ...audios) => pipe(Buffer, Merge)(context, channel, length, ...audios);
const Buffer = (context, channel, length, ...audios) => context.createBuffer(channel, length, context.sampleRate);

const FillBuffer = (buffer, content) => {
    for (let c = 0; c < buffer.numberofChannels; c++)
        buffer.getChannelData(c).set(content.getChannelData(c));
    return buffer;
}

const Copy = () => {

};


document.querySelector("#upload1").onchange = (e) => {
    const files = e.target.files;
    document.querySelector(".audio1").src = URL.createObjectURL(files[0]);

    audioContext = new (window.AudioContext || window.webkitAudioContext);
    ab1 = audioContext.createMediaElementSource(audio1);
    ab1.connect(audioContext.destination);
};

document.querySelector("#upload2").onchange = (e) => {
    const files = e.target.files;
    document.querySelector(".audio2").src = URL.createObjectURL(files[0]);

    audio2 = document.querySelector('.audio2');
    ab2 = audioContext.createMediaElementSource(audio2);
    ab2.connect(audioContext.destination);
    resultNode = audioContext.createMediaElementSource(audio3);

    let node = Merge(audioContext, ab1, ab2);
    console.log(node.stream.getAudioTracks());
    node.connect(resultNode);
    resultNode.connect(audioContext.destination);

    // var file = new File(stream.data, { type: "audio/ogg; codecs=opus" });
    // document.querySelector(".result").src = file;
};

document.querySelector(".audio1").onplay = (e) => {
    if (audioContext.state == "suspended") {
        audioContext.resume();
    }
}

document.querySelector(".audio2").onplay = (e) => {
    if (audioContext.state == "suspended") {
        audioContext.resume();
    }
}


