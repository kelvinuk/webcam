import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AutoSizer } from "react-virtualized";
import { VideoRecorder } from './video-recorder';
import Photo from './Photo';
import './App.css';

export type AppProps = {
  lockNavButton?: boolean;
};

const App: React.FC<AppProps> = ({lockNavButton}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ isAlbum, setIsAlbum ] = useState(false);
  const [images, setImages] = useState<ImageBitmap[]>([]);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const buttonText: string = useMemo(() => 
    isAlbum ? 'Ready to take photos' : 'Back to Album'
  , [isAlbum]);

  const handleClick: React.MouseEventHandler = () => {
    setIsAlbum((prev) => {
      if (prev) {
        setImages([]);
        setVideoUrl('');
      }
      return !prev;
    });
  };

  const handleRecordingResult = (imageList: ImageBitmap[], chunks: BlobPart[], mimeType: string): void => {
    const blob = new Blob(chunks, { type: mimeType });
    setVideoUrl(URL.createObjectURL(blob));

    setImages([...imageList]);
    setIsAlbum(true);
    setButtonDisabled(false);
    buttonRef.current?.focus();
  };

  const handleCameraEnabled = useCallback((): void => {
    if (lockNavButton)
      setButtonDisabled(true);
  }, [lockNavButton]);

  return (
    <div className="App">
      <button ref={buttonRef} disabled={buttonDisabled} onClick={handleClick} style={{ margin: '20px'}}>{buttonText}</button>
      {
        !isAlbum ?
        <VideoRecorder onCameraEnabled={handleCameraEnabled} onRecordingResult={handleRecordingResult}/> :
        <div style={{ flex: '1 1 auto', minHeight: '95vh'}}>
          <AutoSizer>
            {({ height, width }) => (
              <div style={ { height, width} }>
                {images.map((imageBitmap, index) => <Photo id={index} height={height/4} width={width/5} imageBitmap={imageBitmap}/>)}
              </div>
            )}      
          </AutoSizer>
        </div>
      }
      {videoUrl && (
        <div className="recorded">
          <video className="recorded-player" src={videoUrl} controls></video>
          <a download href={videoUrl}>
            Download Recording
          </a>
        </div>         
      )}
    </div>
  );
}

export default App;

