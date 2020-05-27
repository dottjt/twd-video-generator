# Audiogram Generator and YouTube uploader.

There are two scripts here which help me turn my podcast into a video.

## Scripts

- `npm run dev` - this runs a function which turns audio files from within `AUDIO_FOLDER` into videos from within `VIDEO_FOLDER`
- `npm run upload` - upload videos from `VIDEO_FOLDER` to YouTube using `episodes.ts` data.

## Notes

- The episode data are merely symbolic links. So you will require the `thewritersdaily` repo in addition to get them from. Details within the `package.json`
- Please download client secrets json file from Google Developer console and place it as `client_secrets.json` in the root.
- npm i youtube-api fs r-json lien bug-killer opn pretty-bytes
