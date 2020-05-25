# Video Creation Nots

## Convrt wav to mp3

ffmpeg -i track01.wav -acodec mp3 track01.mp3
You can also specify the bitrate of the MP3 with the -ab flag.
ffmpeg -i track01.wav -acodec mp3 -ab 64k track01.mp3

for i in *.wav; do ffmpeg -i "$i" -acodec mp3 -ab 64k "$(basename "$i" .wav)".mp3 ; done
npm i fluent-ffmpeg
npm i googleapis
https://github.com/googleapis/google-api-nodejs-client/


## Creating An Audiowave

<!-- NOT correct, but similar -->
ffmpeg -i input.mp3 -filter_complex mode=cline size=1280x720 output.avi

showwaves=colors=#00FF00:mode=cline

// to get waveforms
Code: ffmpeg -i input -filter_complex "[0:a]showwaves=s=128x96:mode=cline,format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -c:a copy output

## Background Image

// adding a background image.
ffmpeg \
-loop 1 \
-framerate 1 \
-i bg.jpg \
-framerate 1/5 \
-i "C:/test/%03d.jpg" \
-filter_complex "overlay=(W-w)/2:(H-h)/2:shortest=1,format=yuv420p" \
-c:v libx264 \
-r 30 \
-movflags +faststart \
output.mp4
https://superuser.com/questions/876274/insert-background-image-using-ffmpeg

## Add Text
// add text.
ffmpeg -i input.mp4 -vf drawtext="fontfile=/path/to/font.ttf: \
text='Stack Overflow': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: \
boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2" -codec:a copy output.mp4
https://stackoverflow.com/questions/17623676/text-on-video-ffmpeg

## speech to text
https://www.npmjs.com/package/pocketsphinx
https://github.com/cmusphinx/pocketsphinx
https://askubuntu.com/questions/161515/speech-recognition-app-to-convert-mp3-to-text
https://askubuntu.com/questions/837408/convert-speech-mp3-audio-files-to-text
Aegisub