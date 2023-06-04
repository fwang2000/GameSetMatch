# Setup

Create a `.env` file in the root directory of this project. Fill out the following enviroment variables:
```
REACT_APP_API_DOMAIN=<your local api hostname>

REACT_APP_FIREBASE_APIKEY=
REACT_APP_FIREBASE_AUTHDOMAIN=
REACT_APP_FIREBASE_PROJECTID=
REACT_APP_FIREBASE_STORAGEBUCKET=
REACT_APP_FIREBASE_MESSAGINGSENDERID=
REACT_APP_FIREBASE_APPID=
REACT_APP_FIREBASE_MEASUREMENTID=
```

# To run the app:
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# For deployment: 
### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Upload the build folder to the server you want to deploy to. We're using AWS Amplify to serve the front end so just drag and drop the folder to your environment in AWS.
