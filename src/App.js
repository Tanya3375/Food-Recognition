import React, { Component } from 'react';
import './App.css';

import ndarray from 'ndarray';
import ops from 'ndarray-ops';

import { food101topK } from './utils';
import { con } from './utils';


const mapProb = (prob) => {
  if (prob * 100 < 2) {
    return '2%';
  } else {
    return (prob * 100 + '%');
  }
}

const Predictions = ({topK}) => {
  return (
    <center><table className='predictions'>
      <tbody>
      <tr>
        <th className='th'>Prediction</th>
        <th>Calories you consumed</th>
      </tr>
      { topK.map((pred, i) =>
        <tr key={i}>
          <td className='predLabel'>{pred.name}</td>
          <td className='predPercent'>
            <span className='predPercentLabel'>{con(pred.name)}</span>
            <div className='predBar' style={{width: mapProb(pred.probability)}}/>
          </td>
        </tr>
      )}
      </tbody>
    </table></center>
  );
}

class App extends Component {

  constructor() {
    super();


    localStorage.setItem("consumed",0)

    let hasWebgl = false;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) {
      hasWebgl = true;
    } else {
      hasWebgl = false;
    }
    console.log('WebGL enabled:', hasWebgl);

    this.urlInput = null;
    this.state = {
      model: null,
      modelLoaded: false,
      modelLoading: false,
      modelRunning: false,
      imageLoadingError: false,
      loadingPercent: 0,
      classifyPercent: 0,
      topK: null,
      inputTaken: false,
      hasWebgl
    };
  }

  loadModel = () => {
    console.log('Loading Model');
    const model = new window.KerasJS.Model({
      filepaths: {
        model: 'model.json' ,
        weights: 'https://s3.amazonaws.com/stratospark/food-101/model4b.10-0.68_weights.buf',
        metadata: 'model4b.10-0.68_metadata.json'
      },
      gpu: this.state.hasWebgl,
      layerCallPauses: true
    });

    let interval = setInterval(() => {
      const percent = model.getLoadingProgress();
      console.log('Progress', percent, model.xhrProgress);
      this.setState({
        loadingPercent: percent
      });
    }, 100);

    const waitTillReady = model.ready();

    waitTillReady.then(() => {
      clearInterval(interval);
      console.log('Model ready');
      this.setState({
        loadingPercent: 100,
        modelLoading: false,
        modelLoaded: true
      });

      setTimeout(() => this.loadImageToCanvas(), 100);
    })
    .catch(err => {
      clearInterval(interval);
      console.log('err', err);
    });

    this.setState({
      modelLoading: true,
      model
    });
  }

  loadImageToCanvas = () => {
    console.log('Loading Image');
    var file = document.getElementById('file')
    if (!file.value) {
      return;
    };

    this.setState({
      imageLoadingError: false,
      imageLoading: true,
      loadingPercent: 0,
      classifyPercent: 0,
      topK: null
    });
      
      var input, fr, img
      input = document.getElementById('file');
      if (!input) {
            console.log("Um, couldn't find the imgfile element.");
          this.setState({
            imageLoadingError: true,
            imageLoading: false,
            modelRunning: false,
            url: null
          });
        }
        else if (!input.files) {
            console.log("This browser doesn't seem to support the `files` property of file inputs.");
          this.setState({
            imageLoadingError: true,
            imageLoading: false,
            modelRunning: false,
            url: null
          });
        }
        else if (!input.files[0]) {
            console.log("Please select a file before clicking 'Load'");
          this.setState({
            imageLoadingError: true,
            imageLoading: false,
            modelRunning: false,
            url: null
          });

        }
        else {
            file = input.files[0];
            fr = new FileReader();
            fr.onload = createImage;
            fr.readAsDataURL(file);
          this.setState({
            imageLoadingError: false,
            imageLoading: false,
            modelRunning: true
          });
        }
        function createImage() {
            img = new Image();
            img.onload = imageLoaded;
            img.src = fr.result;
        }

        function imageLoaded() {
            var canvas = document.getElementById("input-canvas")
            canvas.width = 299;
            canvas.height = 299;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img,0,0,299,299);	
        }
          setTimeout(() => {
            this.runModel();
          }, 1000)

  }

  runModel = () => {
    console.log('Running Model');

    const ctx = document.getElementById('input-canvas').getContext('2d');
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const { data, width, height } = imageData;

    let dataTensor = ndarray(new Float32Array(data), [ width, height, 4 ]);
    let dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
      width,
      height,
      3
    ]);
    ops.divseq(dataTensor, 255);
    ops.subseq(dataTensor, 0.5);
    ops.mulseq(dataTensor, 2);
    ops.assign(
      dataProcessedTensor.pick(null, null, 0),
      dataTensor.pick(null, null, 0)
    );
    ops.assign(
      dataProcessedTensor.pick(null, null, 1),
      dataTensor.pick(null, null, 1)
    );
    ops.assign(
      dataProcessedTensor.pick(null, null, 2),
      dataTensor.pick(null, null, 2)
    );

    const inputData = { input_1: dataProcessedTensor.data };
    const predPromise = this.state.model.predict(inputData);

    const totalLayers = Object.keys(this.state.model.modelDAG).length
    let interval = setInterval(() => {
      const completedLayers = this.state.model.layersWithResults.length;
      this.setState({
        classifyPercent: ((completedLayers / totalLayers) * 100).toFixed(2)
      });
    }, 50);

    predPromise.then(outputData => {
      console.log(outputData);
      clearInterval(interval);
      const preds = outputData['dense_1'];
      const topK = food101topK(preds,1);
      console.log(topK);
      this.setState({
        topK,
        modelRunning: false
      });
    });
  }

  classifyNewImage = () => {
    console.log('classifying new image', );
    this.loadImageToCanvas();

  }
  showData = () => {
	var sug = parseInt(window.localStorage.getItem('suggested'));
	var cons = parseInt(window.localStorage.getItem('consumed'));
	var str = '\n-----------------------------'
	str = str+'\nTotal Consumed  ->  '+cons
	str = str+'\nSuggested  ->  '+sug
	str = str+'\nTo be consumed  ->  '+(sug-cons)
	alert(str)
  }
  saveData = () => {

	console.log("Initiate Saving Data");
	var sex = (document.getElementById("sex").value).toUpperCase();
	var age = parseInt(document.getElementById("age").value);
	var ht = parseInt(document.getElementById("ht").value);
	var wt = parseInt(document.getElementById("wt").value);
	if( isNaN(age) || isNaN(ht) || isNaN(wt) || !['M','F'].includes(sex)){
		console.log(age)
		console.log(ht)
		console.log(wt)
		console.log(sex)
		console.log("Saving Data Failed")
		alert("Enter data in suggested format")
		document.location.reload(true)
		return
		}
	var cal;
	if( sex === 'M' )
		cal = 864- (9.72*age) + (14.2*wt) + (503 * ht)
	else
		cal = 387- (7.31*age) + (10.9*wt) + (660 * ht)
	console.log(cal);
	console.log("Data saved")
	localStorage.setItem("suggested",cal)
	this.setState({
	inputTaken:true
	});
  }

  render() {
    const {
      loadingPercent,
      modelLoaded,
      modelLoading,
      modelRunning,
      imageLoading,
      imageLoadingError,
      classifyPercent,
      topK,
      inputTaken
    } = this.state;
    return (
      <div className="App"><br></br><br></br>
	<center><div className='heading'>Food Recognition with Calorie Estimation</div></center><br></br><br></br>
        <center><div className='sub-heading'>This app was coded for final year project by <a target="_blank" href="https://github.com/Tanya3375/Food-Recognition">Kumari Tanya</a> (USN:1605033)</div></center><br></br>
        { inputTaken && modelLoaded && !modelRunning ? 
		<center>
			<button onClick={this.showData}>Show Data</button><br></br><br></br>	
		</center>
		
		: ''}
        { !modelLoaded && !inputTaken ?
        <p className='intro'>
          <center><div className='sub-heading-1'>To get started, enter details and click the Save Data.</div></center><br></br>
          <center><div className='sub-heading-1'>This will help us keep track of calories you consome and claories you can further consume</div></center><br></br>
        </p>
        : ''}
	{ !modelLoaded && inputTaken && !modelLoading ?
        <p className='intro'>
          <center><div className='sub-heading-1'>Now click the button to load the model.</div></center><br></br>
        </p>
        : ''}
        <div className='init'>
        { !modelLoaded && !modelLoading &&!inputTaken ? 
		<center>
			<div className='form'>
			<form autoComplete="off">
				Gender : <input type='text' id='sex' placeholder='M/F' pattern='[MFmf]' required></input><br></br><br></br>
				Age : <input type='number' id='age' placeholder='Age' required></input><br></br><br></br>
				Height : <input type='number' id='ht' placeholder='In inches' required></input><br></br><br></br>
				Weight : <input type='number' id='wt' placeholder='In Kilograms' required></input><br></br><br></br>
				<button onClick={this.saveData}>Save Data</button><br></br>
			</form>
			</div>
		</center>
		
		: ''}
        { !modelLoaded && !modelLoading && inputTaken ? 
		<center>
			<button onClick={this.loadModel}>Start</button><br></br><br></br>	
		</center>
		
		: ''}

        { !modelLoaded && modelLoading ?
          <p className='loading'>
<center><div className='sub-heading-1'>Your data has been saved, and the model is currently loading. Once loaded, you can start using the app</div></center><br></br>
<center><div className='sub-heading-1'>LOADING MODEL: {loadingPercent}%</div></center><br></br>
</p>
          : ''}
        { modelLoaded && imageLoading ?
          <p className='loading'><div className='sub-heading-1'>LOADING IMAGE</div><br></br></p>
          : ''}
        { modelLoaded && imageLoadingError ?
          <p className='error'><center><div className='sub-heading-1'>ERROR LOADING IMAGE.<br/>TRY DIFFERENT URL</div></center><br></br></p>
          : ''}
        { modelLoaded && modelRunning ?
          <p className='loading'><center><div className='sub-heading-1'>CLASSIFYING: {classifyPercent}%</div></center><br></br></p>
          : ''}
        </div>
        <div className='interactive'>
          { modelLoaded && !modelRunning && !imageLoading ?
          <p>
            <center>Food Image: <input type='file' id='file' ref={(input) => { this.urlInput = input; }}/>
            <br/><br/>
            <button onClick={this.classifyNewImage}>Classify Image</button></center>
          </p>
          : '' }
          <center><canvas id='input-canvas' width='299' height='299'/></center>
          { topK ? <Predictions topK={topK}/> : ''}
        </div>
      </div>
    );
  }
}

export default App;
