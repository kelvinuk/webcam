
import React, { useEffect, useCallback, useRef } from 'react';

export type PhotoProps = {
  imageBitmap: ImageBitmap;
  width?: number;
  height?: number;
}

const Photo: React.FC<PhotoProps> = ({
  imageBitmap,
  width = imageBitmap.width,
  height = imageBitmap.height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPhotos = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      canvas.getContext('2d')?.drawImage(imageBitmap, 0, 0);
    }
  }, [imageBitmap]);  

  useEffect(() => {
    renderPhotos();
  },[renderPhotos]);

  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
    >
    </canvas>
  );
};

export default Photo;

