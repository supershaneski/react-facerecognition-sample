import React from 'react';
import * as faceapi from 'face-api.js'
import classes from './App.module.css';

const TEST_IMAGE_URL = process.env.PUBLIC_URL;
const MODEL_URL = process.env.PUBLIC_URL + '/models'

const FaceDetectors = {
  SSD_MOBILENETV1: "ssd_mobilenetv1",
  TINY_FACE_DETECTOR: "tiny_face_detector"
}

var faceMatcher = null

const listInputSizes = [160, 224, 320, 416, 512, 608]

class App extends React.PureComponent {

  constructor(props) {
    
    super(props)

    this.state = {
      selectedFaceDetector: FaceDetectors.TINY_FACE_DETECTOR,
      minConfidence: 0.5,
      scoreThreshold: 0.5,
      inputSize: 608,
      inputIndex: 5,
      refMessage: "",
      queryMessage: "",
      loaderRef: false,
      queryLoader: false,
    }

    this.refCanvas = React.createRef()
    this.refImage = React.createRef()
    this.refFile = React.createRef()

    this.queryCanvas = React.createRef()
    this.queryImage = React.createRef()
    this.queryFile = React.createRef()

    this.loadRefImage = this.loadRefImage.bind(this)
    this.loadQueryImage = this.loadQueryImage.bind(this)

    this.loadTinyModel = this.loadTinyModel.bind(this)
    
    this.getFaceDetectorOptions = this.getFaceDetectorOptions.bind(this)
    this.getCurrentFaceDetectionNet = this.getCurrentFaceDetectionNet.bind(this)
    this.isFaceDetectionModelLoaded = this.isFaceDetectionModelLoaded.bind(this)

    this.updateRefImageResults = this.updateRefImageResults.bind(this)
    this.updateQueryImageResults = this.updateQueryImageResults.bind(this)

  }

  async componentDidMount() {

    await faceapi.loadTinyFaceDetectorModel(MODEL_URL)
    await faceapi.loadFaceLandmarkTinyModel(MODEL_URL)
    await faceapi.loadFaceRecognitionModel(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    
  }

  async loadRefImage() {
    
    this.setState({
      inputSize: 608,
      inputIndex: 5,
      refMessage: "Processing...",
      loaderRef: true,
    })

    const ctx = this.refCanvas.current.getContext("2d")
    ctx.clearRect(0, 0, 300, 450)
    
    const imgFile = this.refFile.current.files[0]
    const img = await faceapi.bufferToImage(imgFile)
    this.refImage.current.src = img.src;

    //await this.loadTinyModel()
    await this.updateRefImageResults()

  }

  async loadQueryImage() {

    this.setState({
      inputSize: 608,
      inputIndex: 5,
      queryMessage: "Processing...",
      queryLoader: true,
    })

    const ctx = this.queryCanvas.current.getContext("2d")
    ctx.clearRect(0, 0, 300, 450)
    
    const imgFile = this.queryFile.current.files[0]
    const img = await faceapi.bufferToImage(imgFile)
    this.queryImage.current.src = img.src;
    
    //await this.loadTinyModel()
    await this.updateQueryImageResults()

  }

  async loadTinyModel() {
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
  }

  getFaceDetectorOptions() {
    return this.state.selectedFaceDetector === FaceDetectors.SSD_MOBILENETV1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence: this.state.minConfidence })
        : new faceapi.TinyFaceDetectorOptions({ inputSize: this.state.inputSize, scoreThreshold: this.state.scoreThreshold })
  }

  getCurrentFaceDetectionNet() {
    if(this.state.selectedFaceDetector === FaceDetectors.SSD_MOBILENETV1) {
        return faceapi.nets.ssdMobilenetv1
    } else {
        return faceapi.nets.tinyFaceDetector
    }
  }

  isFaceDetectionModelLoaded() {
    return !!this.getCurrentFaceDetectionNet().params
  }

  async updateRefImageResults() {
    
    const fullFaceDescriptions = await faceapi
      .detectAllFaces(this.refImage.current, this.getFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()
    

    if(!fullFaceDescriptions.length) {
      
      if(this.state.inputIndex > 0) {
        
        this.setState((prev) => ({
          inputIndex: prev.inputIndex - 1,
          inputSize: listInputSizes[prev.inputIndex - 1],
        }))
        
        setTimeout(() => {

          this.updateRefImageResults()

        }, 500)

      } else {
        
        this.setState({
          refMessage: "Not detected",
          loaderRef: false,
        })
        
      }

      return;
    }
    
    faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions)
    
    faceapi.matchDimensions(this.refCanvas.current, this.refImage.current)
    const resizedResults = faceapi.resizeResults(fullFaceDescriptions, this.refImage.current)
    
    const labels = faceMatcher.labeledDescriptors
      .map(ld => ld.label)
    
    var boxColor = '#f0d';

    resizedResults.forEach(({ detection, descriptor }) => {
      const label = faceMatcher.findBestMatch(descriptor).toString()
      const options = { label, boxColor }
      const drawBox = new faceapi.draw.DrawBox(detection.box, options)
      drawBox.draw(this.refCanvas.current)
    })
    
    this.setState({
      refMessage: "Loaded",
      loaderRef: false,
    })
    
  }

  async updateQueryImageResults() {
    
    if(!faceMatcher) {

      this.setState({
        queryMessage: "No ref image found",
        queryLoader: false,
      })

      return;
    }
    
    const results = await faceapi
      .detectAllFaces(this.queryImage.current, this.getFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()
    
    faceapi.matchDimensions(this.queryCanvas.current, this.queryImage.current)
    
    const resizedResults = faceapi.resizeResults(results, this.queryImage.current)

    const score = resizedResults.length > 0 ? resizedResults[0].detection._score : 0;
    
    const boxColor = '#0df';
    var label;

    resizedResults.forEach(({detection, descriptor}) => {
      label = faceMatcher.findBestMatch(descriptor).toString()
      const options = { label, boxColor }
      const drawBox = new faceapi.draw.DrawBox(detection.box, options)
      drawBox.draw(this.queryCanvas.current)
    })

    if(score === 0 && this.state.inputIndex > 0) {
      
      this.setState((prev) => ({
        inputIndex: prev.inputIndex - 1,
        inputSize: listInputSizes[prev.inputIndex - 1],
        queryMessage: "Processing... ",
      }))

      setTimeout(() => {

        this.updateQueryImageResults()

      }, 500)

    } else {

      if(score === 0) {
        
        this.setState({
          queryMessage: "No match",
          queryLoader: false,
        })

      } else {
        
        this.setState({
          queryMessage: label.indexOf("unknown") >= 0 ? "No match found" : "Match found",
          queryLoader: false,
        })

      }

    }

  }

  render() {

    return (
      <div className={classes.container}>
        
        <div className={classes.header}>
          <h4 className={classes.title}>Face Recognition Sample</h4>
        </div>

        <div className={classes.main}>

          <div className={classes.panel}>
            <h4 className={classes.subtitle}>Reference Image - {this.state.refMessage}</h4>
            <div className={classes.imagePanel}>
              <img ref={this.refImage} className={classes.image} src={TEST_IMAGE_URL} alt="" />
              <canvas ref={this.refCanvas} className={classes.canvas} width={300} height={450} />
              {
                this.state.loaderRef &&
                <div className={classes.loader}><span>Processing...</span></div>
              }
            </div>
            <div className={classes.control}>
              <input ref={this.refFile} type="file" accept="image/png, image/jpeg" onChange={this.loadRefImage} /> 
            </div>
          </div>

          <div className={classes.panel}>
            <h4 className={classes.subtitle}>Query Image - {this.state.queryMessage}</h4>
            <div className={classes.imagePanel}>
              <img ref={this.queryImage} className={classes.image} src="" alt="" />
              <canvas ref={this.queryCanvas} className={classes.canvas} width={300} height={450} />
              {
                this.state.queryLoader &&
                <div className={classes.queryLoader}><span>Processing...</span></div>
              }
            </div>
            <div className={classes.control}>
              <input ref={this.queryFile} type="file" accept="image/png, image/jpeg" onChange={this.loadQueryImage} /> 
            </div>
          </div>

        </div>
        
      </div>
    )

  }

}

export default App;
