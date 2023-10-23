import React, { useCallback, useMemo, useState } from 'react';
import { VideoRecorder } from './video-recorder';
import Photo from './Photo';

export type VideoFrameProps = {
  width?: number;
  height?: number;
};

const App: React.FC<VideoFrameProps> = ({
  width = 1024,
  height = 600,
}) => {
  const [ isCompleted, setIsCompleted ] = useState(false);
  const [images, setImages] = useState<ImageBitmap[]>([]);

  const handleClick: React.MouseEventHandler = () => {
    setIsCompleted((prev) => {
      if (prev) {
        setImages([]);
      }
      return !prev;
    });
  };

  const buttonText: string = useMemo(() => 
    isCompleted ? 'Ready to take photos' : 'Go back'
  , [isCompleted]);

  const handleRecordingResult = useCallback((imageList: ImageBitmap[]): void => {
    setImages([...imageList]);
    console.log(imageList);

    setIsCompleted(true);

  }, []);

  return (<div className="App">
    <button onClick={handleClick}>{buttonText}</button>
    {
      !isCompleted &&
      <VideoRecorder onRecordingResult={handleRecordingResult}/>
    }
    <div>
    {
      images.map((imageBitmap) => <Photo imageBitmap={imageBitmap}/>)
    }
    </div>
  </div>);
}

export default App;

