export const defaultConstraints: MediaStreamConstraints = {
  audio: false,
  video: {width: 1280, height: 720, frameRate: 25}, // 0.04 ms
};

// https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/mimeType
// mp4?
export const defaultMimeType: string = 'video/webm; codecs="opus,vp8"';
export const defaultVideoBufTimeslice = 10; // 10 ms
export const defaultColorChangeCycle = 12.5; // 0.5 sec / 0.04 ms = 12.5 
export const defaultBestFrameForPhotoCapture = 6; // the 6th frame as the lighting is more stable
export const defaultBgPatterns = [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ];

export type VideoRecorderProps = {
  constraints?: MediaStreamConstraints;
  mimeType?: string; // MIME type for final video in Blob
  videoBufTimeslice?: number; // start recorder with ms buffer
  bgPatterns? : number[];
  colorChangeCycle?: number;
  bestFrameForPhotoCapture?: number;
  onCameraEnabled?: () => void;
  onRecordingResult?: (imageList: ImageBitmap[], chunks: BlobPart[], mimeType: string) => void;
};
