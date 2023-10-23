
We capture 20 photos in 10 seconds following a predefined troggable backlight sequence.
![image](https://github.com/kelvinuk/webcam/assets/85465033/5c1f1142-cfd0-405c-80ac-c4af30967b27)

The backlight relies on a changable black / white screen color.
![image](https://github.com/kelvinuk/webcam/assets/85465033/6e5d937d-384a-4bf3-bfaf-757aa2a7e4f2)

The recording page has a small live video preview and control.
User needs to premit the software to access the camera.
The software would choose the best camera if multiple capturable devicec are attached
(According to the documentation,  the latest getUserMedia should select the best camera)

When the system has taken 20 photos, the system would stop recording, clean up resources allocation and leave the recording page.
Back to gallery home page, the video recording page would be destroyed.

We provide autosizing method to put all resizable photos in the gallary.
However, the original samples are preserved. They can be sent back to the server.

Configurable Parameters
```
export const defaultConstraints: MediaStreamConstraints = {
  audio: false,
  video: {width: 1280, height: 720, frameRate: 25}, // 0.04 ms
};

export const defaultMimeType: string = 'video/webm; codecs="opus,vp8"';
export const defaultVideoBufTimeslice = 10; // 10 ms
// We have 20 cycles, each cycle consumes 0.5 seconds. We take a photo around 50% of each cycle
export const defaultColorChangeCycle = 12.5; // 0.5 sec / 0.04 ms = 12.5 frames / per cycle
export const defaultBestFrameForPhotoCapture = 6; // the 6th frame in the cycle as the lighting is more stable
export const defaultBgPatterns = [ 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1 ];
```
In short, we have 0.25 sec delay of each changable correct pattern.
This 0.25 sec has enough window for the LCD stability and human reaction 
(Huamn response time is 0.08 sec)

Remaindings
- Unit Tests
  - Jest test, cypress tests can be added.
- Styling CSS improvement
- Error Reporting (Using Toast box)

Remarks:
- I left some console.log for illustration purposes. Those message should be cleaned up for real deployment
- Currently, I use alert to replace console.error. However, they should be displayed by toast box
- For real deployment, we can use next JS to handle the server side communication and transfer the images back to server
- Logitech cammera cannot switch off its light once activated
- For multiple capture devices, the getUserMedia may give the wrong selection. It may still provide the media server even the USB is disconnected.
    
========================================================================================================================



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
