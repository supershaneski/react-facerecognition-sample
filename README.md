# react-facerecognition-sample

A sample React project using [face-api.js](https://www.npmjs.com/package/face-api.js) to implement a **face recognition application** with particular focus on **people with face mask on**.

I know that it is a difficult thing to do and somewhat a holy grail.
But, I think, the question is not if it is impossible to do (*nothing is impossible!*) but rather if I can make it, will it be accurate?

Well, it depends. If it can make correct prediction that is at the same rate as a real person then I think that it is good enough as a proof of concept.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How To Use (v0.1.0 2021/07/30)

Install the project first and run (see instructions below).

### Load the reference image.

1. Select the file input and choose a reference photo or if you are in mobile, take a picture.
2. A box will be drawn if a face is detected and a name will be assigned.

### Next, load the query/comparison image.

1. Do the same thing like in (1) above.
2. If the face is detected and there is match, it will show the name. Otherwise, unknown will be shown. If the face is not detected, it will not show any box.


**Note: If you are going to test this `with face mask on`, you must make the `reference image without the face mask`.**


## Available Scripts

First, download or clone the project.

In the project directory, you can run:

### `npm install`

Installs all the required modules used in the project.

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

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
