import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { VideoRecorderProps, defaultColorChangeCycle, defaultConstraints, defaultBgPatterns, defaultMimeType, defaultVideoBufTimeslice, defaultBestFrameForPhotoCapture } from "./types";
import { ImageCapture, ImageBitmap } from 'image-capture';
import './index.css';

const VideoRecorder: React.FC<VideoRecorderProps> = ({
  constraints = defaultConstraints,
  mimeType = defaultMimeType,
  videoBufTimeslice = defaultVideoBufTimeslice,
  bgPatterns = defaultBgPatterns,
  colorChangeCycle = defaultColorChangeCycle,
  bestFrameForPhotoCapture = defaultBestFrameForPhotoCapture,
  onRecordingResult
}) => {
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const chunks = useRef<any>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<ImageBitmap[]>([]);

  const mediaRecorder = useRef<MediaRecorder | undefined>(undefined);
  const imageCaptureDeviceRef = useRef<any>(undefined);
  const [permission, setPermission] = useState(false);
  const [isRecording, setIsRecording ] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [backlight, setBacklight] = useState<number>(defaultBgPatterns.length > 0 ? defaultBgPatterns[0] : 0);

  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    // Choose the best resolution camera
    if ("MediaRecorder" in window) {
      try {
        // get Media device - refenece Web APIs | MDN
        //const deviceInfoList: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices();
        //const cameraId: string = deviceInfoList.sort((a,b) => { a.maxWidth > b.maxWidth }).deviceId;
        //console.log(deviceInfoList);
        //const cameraId: string = deviceInfoList[0].deviceId;
        //const video: MediaTrackConstraints = constraints.video as MediaTrackConstraints ?? {};

        // getUserMedia should get the best resolution by default
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          ...constraints,
          //video: { ...video, deviceId: { exact: cameraId } }
        });
        setPermission(true);
        setStream(mediaStream);
        const tracks: MediaStreamTrack[] = mediaStream.getVideoTracks() ?? [];
        if (tracks.length> 0) {
          imageCaptureDeviceRef.current = new ImageCapture(tracks[0]);
          //console.log(imageCapture);
        }

        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = mediaStream;
        }
        return true;
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error(`Unknown error ${JSON.stringify(err)}`);
        }
      }
    } else {
      console.error("The MediaRecorder API is not supported in this browser.");
    }
    return false;
  }, [ constraints ]);

  const stopRecording = useCallback(async (): Promise<boolean> => {
    if (!mediaRecorder.current) {
      console.log('no media recorder');
      return false;
    }

    /*
    if (!isRecording) {
      console.log('is not recording');
      return false;
    }
    */

    try {
      mediaRecorder.current?.stop();

      setIsRecording(false);
      console.log('stopped');
      return true;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(`Unknown error ${JSON.stringify(err)}`);
      }
    }

    return false;
  }, []);

  const processFrame = (imageBitmap: ImageBitmap): void => {
    console.log(imageBitmap);
    imagesRef.current.push(imageBitmap);
  }
  
  const stopCamera = (error: Error) => {
    console.error(error);
    // if (videoDevice) videoDevice.stop();  // turn off the camera
  }

  const handleMediaRecordDataAvailable = useCallback((ev: BlobEvent): void => {
    if (ev?.data?.size > 0) {
      chunks.current.push(ev.data);
      if (colorChangeCycle > 0 && bgPatterns.length > 0) {
        const frameCount = (chunks.current.length -1)% colorChangeCycle;
        if (frameCount <= 0.5) {
          const t = Math.floor((chunks.current.length - 1) / colorChangeCycle);
          const bg = bgPatterns[t % bgPatterns.length];
          console.log(`${t} ${bg}`);
  
  
          setBacklight(bg);
          if (t >= bgPatterns.length) {
            console.log('Stopping');
            stopRecording();
          }
        } else if (frameCount >= bestFrameForPhotoCapture && frameCount <= bestFrameForPhotoCapture + 0.5) {
          console.log(frameCount);
          if (imageCaptureDeviceRef.current) {
            //imageCaptureDeviceRef.current.takePhoto().then(processPhoto).catch(stopCamera);
            imageCaptureDeviceRef.current.grabFrame().then(processFrame).catch(stopCamera);
          }
        }
      }
    }
  }, [colorChangeCycle, bgPatterns, bestFrameForPhotoCapture, stopRecording]);

  const handleMediaRecordStop = useCallback((e: Event): void => {
    const blob = new Blob(chunks.current, { type: mimeType });
    setVideoUrl(URL.createObjectURL(blob));
    onRecordingResult?.(imagesRef.current);
    chunks.current = [];
  }, [mimeType, onRecordingResult]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!permission || !stream) {
      console.log('no permission, no stream');
      return false;
    }

    if (isRecording) {
      console.log('is recording');
      return true;
    }
    
    try {
      if (!mediaRecorder.current) {
        mediaRecorder.current = new MediaRecorder(stream, {mimeType});
        mediaRecorder.current.onstop = handleMediaRecordStop;
        mediaRecorder.current.ondataavailable = handleMediaRecordDataAvailable;
      }

      // start recorder with 10ms buffer
      setIsRecording(true);
      mediaRecorder.current.start(videoBufTimeslice);
      
      return true;
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(`Unknown error ${JSON.stringify(err)}`);
      }
    }

    return false;
  }, [handleMediaRecordDataAvailable, handleMediaRecordStop, isRecording, mimeType, permission, stream, videoBufTimeslice]);


  const handleClick: React.MouseEventHandler = useCallback(() => {
    isRecording ? stopRecording() : startRecording();
  }, [isRecording, startRecording, stopRecording]);

  const buttonText: string = useMemo(() => 
    isRecording ? 'Stop Recording' : 'Start Recording'
  , [isRecording]);

  useEffect(() => {

  }, []);
  
  return (
    <div>
      <h2>Video Recorder</h2>
      <div className="video-controls">
        {!permission ? (
          <button onClick={checkCameraPermission} type="button">
            Get Camera Device
          </button>
        ):null}
        {permission ? (
          <button onClick={handleClick}>{buttonText}</button>
        ):null}
      </div>
      <div className='backlight' style={ { backgroundColor: backlight === 0 ? 'black' : 'white' } }>

      </div>
      {videoUrl ? (
        <div className="recorded">
          <video className="recorded-player" src={videoUrl} controls></video>
          <a download href={videoUrl}>
            Download Recording
          </a>
        </div>        
      ) : (
        <video ref={liveVideoRef} autoPlay className="live-player"></video>
      )}
    </div>
  );
};

export default VideoRecorder;