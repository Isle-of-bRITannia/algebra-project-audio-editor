// Credits: https://stackoverflow.com/questions/22135056/overlay-two-audio-buffers-into-one-buffer-source
function mixBuffers(context, ...buffers) {

    var nbBuffer = buffers.length;
    var maxChannels = 0;
    var maxDuration = 0;

    for (var i = 0; i < nbBuffer; i++) {
        if (buffers[i].numberOfChannels > maxChannels) {
            maxChannels = buffers[i].numberOfChannels;
        }
        if (buffers[i].duration > maxDuration) {
            maxDuration = buffers[i].duration;
        }
    }

    // Get the output buffer (which is an array of datas) with the right number of channels and size/duration
    var mixed = context.createBuffer(maxChannels, context.sampleRate * maxDuration, context.sampleRate);        

    for (var j = 0; j < nbBuffer; j++){

        // For each channel contained in a buffer...
        for (var srcChannel = 0; srcChannel < buffers[j].numberOfChannels; srcChannel++) {

            var _out = mixed.getChannelData(srcChannel);
            var _in = buffers[j].getChannelData(srcChannel);

            for (var i = 0; i < _in.length; i++) {
                _out[i] += _in[i];
            }
        }
    }

    return mixed;
}

// Credits: https://stackoverflow.com/questions/18919350/merging-layering-multiple-arraybuffers-into-one-audiobuffer-using-web-audio-ap
function concatenateTwoBuffers(context, buffer1, buffer2){
    if (!buffer1 || !buffer2) {
        console.log("no buffers!");
        return null;
    }

    if (buffer1.numberOfChannels != buffer2.numberOfChannels) {
        console.log("number of channels is not the same!");
        return null;
    }

    if (buffer1.sampleRate != buffer2.sampleRate) {
        console.log("sample rates don't match!");
        return null;
    }

    var tmp = context.createBuffer(buffer1.numberOfChannels, buffer1.length + buffer2.length, buffer1.sampleRate);

    for (var i = 0; i < tmp.numberOfChannels; i++) {
        var data = tmp.getChannelData(i);
        data.set(buffer1.getChannelData(i));
        data.set(buffer2.getChannelData(i), buffer1.length);
    }
    return tmp;
};

// Credits: https://miguelmota.com/bytes/slice-audiobuffer/
function audioBufferSlice(context, buffer, begin, end, callback){
    if (!(this instanceof audioBufferSlice)) {
      return new audioBufferSlice(context, buffer, begin, end, callback);
    }
  
    var error = null;
  
    var duration = buffer.duration;
    var channels = buffer.numberOfChannels;
    var rate = buffer.sampleRate;
  
    if (typeof end === 'function') {
      callback = end;
      end = duration;
    }
  
    // milliseconds to seconds
    begin = begin/1000;
    end = end/1000;
  
    if (begin < 0) {
      error = new RangeError('begin time must be greater than 0!');
    }
  
    if (end > duration) {
      error = new RangeError('end time must be less than or equal to ' + duration + '!');
    }
  
    if (typeof callback !== 'function') {
      error = new TypeError('callback must be a function!');
    }
  
    var startOffset = rate * begin;
    var endOffset = rate * end;
    var frameCount = endOffset - startOffset;
    var newArrayBuffer;
  
    try {
      newArrayBuffer = context.createBuffer(channels, endOffset - startOffset, rate);
      var anotherArray = new Float32Array(frameCount);
      var offset = 0;
  
      for (var channel = 0; channel < channels; channel++) {
        buffer.copyFromChannel(anotherArray, channel, startOffset);
        newArrayBuffer.copyToChannel(anotherArray, channel, offset);
      }
    } catch(e) {
      error = e;
    }
  
    callback(error, newArrayBuffer);
}

function slice(context, buffer, begin, end){
  let slice;
  audioBufferSlice(context, buffer, begin, end, function(error, slicedAudioBuffer) {
    if (error) console.error(error);
    else slice = slicedAudioBuffer;
  });
  return slice;
}

export { mixBuffers, concatenateTwoBuffers, slice };