import React from 'react';
import { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

//Clarifai api key initialization
const app = new Clarifai.App({
 apiKey: '377b9f8df0664880a5a13b9c612b9e22'
});

const constParticles = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    },


    line_linked: {
     shadow: {
       enable: true,
       color: "purple",         
     }
    }
  }
} 

class App extends Component {

  constructor() {
  super();
  this.state = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false
  }
};

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);

  return {
    leftCol: clarifaiFace.left_col * width,
    rightCol: width - (clarifaiFace.right_col * width),
    topRow: clarifaiFace.top_row * height,
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

onInputChange = (event) => {
  this.setState({input: event.target.value});
}

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if (route === 'home') {
    this.setState({isSignedIn: true})
  } else {
    this.setState({isSignedIn: false})
  }
  this.setState({route: route});
}

render() {
  const { input, isSignedIn, imageUrl, box, route } = this.state;
  return (
    <div className="App">
      <Particles className='particles' params={ constParticles } />
     <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />

      { route === 'home'
        ? <div> 
          <Logo /> 
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} />
          
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>

        : (
          route === 'signin'
          ? <Signin onRouteChange={this.onRouteChange} />
          : <Register onRouteChange={this.onRouteChange} />
         )
      }
      
    </div>
  );}
}

export default App;
