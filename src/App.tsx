import React, { useMemo, useState } from 'react';
import { AutoSizer } from "react-virtualized";
import { VideoRecorder } from './video-recorder';
import Photo from './Photo';
import './App.css';

const App: React.FC = () => {
  const [ isAlbum, setIsAlbum ] = useState(false);
  const [images, setImages] = useState<ImageBitmap[]>([]);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);

  const buttonText: string = useMemo(() => 
    isAlbum ? 'Ready to take photos' : 'Back to Album'
  , [isAlbum]);

  const handleClick: React.MouseEventHandler = () => {
    setIsAlbum((prev) => {
      if (prev) {
        setImages([]);
      }
      return !prev;
    });
  };

  const handleRecordingResult = (imageList: ImageBitmap[]): void => {
    setImages([...imageList]);
    setIsAlbum(true);
    setButtonDisabled(false);
  };

  const handleCameraEnabled = (): void => {
    setButtonDisabled(true);
  };

  return (
    <div className="App">
      <button disabled={buttonDisabled} onClick={handleClick} style={{ margin: '20px'}}>{buttonText}</button>
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
    </div>
  );
}

export default App;

