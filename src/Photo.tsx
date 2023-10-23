
import React, { useEffect, useCallback, useRef } from 'react';

export type PhotoProps = {
  id: number;
  imageBitmap: ImageBitmap;
  width?: number;
  height?: number;
}

const Photo: React.FC<PhotoProps> = ({
  id,
  imageBitmap,
  width = imageBitmap.width,
  height = imageBitmap.height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPhotos = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      var imgWidth = imageBitmap.width;
      var screenWidth  = width;
      var scaleX = 1;
      if (imgWidth > screenWidth)
          scaleX = screenWidth/imgWidth;
      var imgHeight = imageBitmap.height;
      var screenHeight = height;
      var scaleY = 1;
      if (imgHeight > screenHeight)
          scaleY = screenHeight/imgHeight;
      var scale = scaleY;
      if(scaleX < scaleY)
          scale = scaleX;
      if(scale < 1){
          imgHeight = imgHeight*scale;
          imgWidth = imgWidth*scale;          
      }
  
      canvas.height = imgHeight;
      canvas.width = imgWidth;
  
      canvas.getContext('2d')?.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, 0, 0, imgWidth, imgHeight);
    }
  }, [height, imageBitmap, width]);  

  useEffect(() => {
    renderPhotos();
  },[renderPhotos]);

  return (
    <canvas
      key={`photo-${id}`}
      ref={canvasRef}
      width={width}
      height={height}
    >
    </canvas>
  );
};

export default Photo;

