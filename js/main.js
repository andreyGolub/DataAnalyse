let app = require('electron').remote;
let fs = require('fs');
let {Analys} = require('./js/analys.js');
let dialog = app.dialog;
let anal;
let $ = require('./js/jquery.js');
const ALPHA = 0.05;
var player = document.getElementById("myAudio"); 

Plotly.newPlot('chart');
Plotly.newPlot('diogram');

document.getElementById('openButton').onclick = () => {
  dialog.showOpenDialog((fileName) => {
    fileName === undefined ?
      alert('No file selected') :
      readFile(fileName[0]);
  });
}

$('body').on('click',() => {
  console.log("pisos");
  player.play();
});

function readFile(path) {
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      alert(err);
      return;
    }
    let stringArr = data.split("\n");
    let arrX = [];
    let arrY = [];
    for (let i = 0; i < stringArr.length; i++) {
      let tmp = stringArr[i].split(" ");
      arrX[i] = tmp[0];
      arrY[i] = tmp[tmp.length - 1];
    }
    anal = new Analys(arrX, arrY, ALPHA);
    //anal.analyse();

    drawField(anal.arrX, anal.arrY, anal);
    updateTable();
  });
}

function updateTable() {
  $(`#Pvalue`).text(anal.pearson.toFixed(4));
  $(`#Pstat`).text(anal.statPearson.toFixed(4));
  $(`#Pquantile`).text(anal.pearsonQuantile.toFixed(4));
  $(`#Psign`).text(anal.pearsonSignificanse);
  if (anal.pearsonSignificanse) {
    $(`#Pinterval`).text('[' + anal.pearsonInterval[0].toFixed(4) + '; ' + anal.pearsonInterval[1].toFixed(4) + ']');
  }

  $(`#Avalue`).text(anal.a0.toFixed(4));
  $(`#Adisp`).text(anal.a0Disp.toFixed(4));
  $(`#Astat`).text(anal.statA0.toFixed(4));
  $(`#Aquantile`).text(anal.aQuantile.toFixed(4));
  $(`#Asign`).text(anal.a0Significanse);
  if (anal.a0Significanse) {
    $(`#Ainterval`).text('[' + anal.a0Interval[0].toFixed(4) + '; ' + anal.a0Interval[1].toFixed(4) + ']');
  }
  

  $(`#Bvalue`).text(anal.a1.toFixed(4));
  $(`#Bdisp`).text(anal.a1Disp.toFixed(4));
  $(`#Bstat`).text(anal.statA1.toFixed(4));
  $(`#Bquantile`).text(anal.aQuantile.toFixed(4));
  $(`#Bsign`).text(anal.a1Significanse);
  if (anal.a1Significanse) {
    $(`#Binterval`).text('[' + anal.a1Interval[0].toFixed(4) + '; ' + anal.a1Interval[1].toFixed(4) + ']');
  }

  $(`#Det`).text(anal.determinationCoef.toFixed(4));
}

function drawField(arrX, arrY) {
  let points = {
    x: arrX,
    y: arrY,
    name: 'Correlation field',
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: '#A61A00'
    }
  };
  let r0 = anal.regressionFunction(anal.minX);
  let rn = anal.regressionFunction(anal.maxX);
  let regressionLine = {
    x: [anal.minX, anal.maxX],
    y: [r0, rn],
    name: 'Correlation line',
    mode: 'lines',
    marker: {
      color: '#FF2800'
    }
  }

  let xUp = [];
  let xDown = [];
  let yUp = [];
  let yDown = [];
  for (let i = 0; i < anal.arrX.length; i++) {
    xDown[i] = anal.regressionInterval[i][0];
    xUp[i] = anal.regressionInterval[i][1];
    yDown[i] = anal.predictionInterval[i][0];
    yUp[i] = anal.predictionInterval[i][1];
  }
  let regDown = {
    x: anal.sortedX,
    y: xDown,
    name: 'Regression interval',
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: '#FF5D40'
    }
  };
  let regUp = {
    x: anal.sortedX,
    y: xUp,
    name: 'Regression interval',
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: '#FF5D40'
    }
  };
  let predDown = {
    x: anal.sortedX,
    y: yDown,
    name: 'Predictional interval',
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: '#FF5D40'
    }
  };
  let predUp = {
    x: anal.sortedX,
    y: yUp,
    name: 'Predictional interval',
    type: 'scatter',
    mode: 'lines',
    marker: {
      color: '#FF5D40'
    }
  };

  let data = [points, regressionLine, regDown, regUp, predDown, predUp];
  Plotly.newPlot('chart', data);

  let residualPlot = {
    x: anal.regArr,
    y: anal.remainsArr,
    name: 'Residual plot',
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: '#A61A00'
    }
  }

  Plotly.newPlot('diogram',residualPlot);
}
