const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

if (fs.existsSync(process.cwd() + "/out.mkv")) return console.log('\n\x1b[5m\x1b[30m\x1b[41m✗\x1b[0m \x1b[31mVideo already has been transcoded. If that\'s not true delete the out.mkv file!')

return ffmpeg()
    .input(process.cwd() + '/input.mkv')
    .videoCodec('libx265')
    .outputOption(['-vtag hvc1', '-crf 19', '-preset placebo', '-x265-params', "qcomp=0.70:merange=57:ref=6:bframes=16:subme=7:no-rect=1:no-amp=1:no-sao=1:no-strong-intra-smoothing=1", '-map 0', '-c:a copy', '-c:s copy'])
    .on('start', commandLine => console.log('Spawned Ffmpeg with command: ' + commandLine))
    .on('codecData', data => console.log('Input is ' + data.audio + ' audio ' + 'with ' + data.video + ' video'))
    .on('progress', progress => console.log('Processing: ' + progress.percent + '%'))
    .on('stderr', stderrLine => console.log(stderrLine))
    .on('error', (err) => console.log('Cannot process video: ' + err.message))
    .on('end', () => {
        console.log('Transcoding succeeded!');
    })
    .save(process.cwd() + "/out.mkv");