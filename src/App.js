import React from 'react';
import classes from './App.module.css';

const TEST_IMAGE_URL = process.env.PUBLIC_URL; // + '/person1.jpg'

class App extends React.PureComponent {

  constructor(props) {
    
    super(props)

    this.refImage = React.createRef()
    this.refCanvas = React.createRef()

  }

  render() {

    return (
      <div className={classes.container}>
        <div className={classes.header}>
          <h4 className={classes.title}>Sample App</h4>
        </div>
        <div className={classes.panel}>
          <h4 className={classes.subtitle}>Reference Image</h4>
          <div className={classes.imagePanel}>
            <img ref={this.refImage} className={classes.image} src={TEST_IMAGE_URL} alt="" />
            <canvas ref={this.refCanvas} className={classes.canvas} width={300} height={450} />
          </div>
          <div className={classes.control}>
            <input ref={this.refFile} type="file" accept="image/png, image/jpeg" onChange={this.loadRefImage} /> 
          </div>
        </div>
      </div>
    )

  }

}

export default App;
