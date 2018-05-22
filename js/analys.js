let {Quantile} = require('./quantile.js');

class Anal {
    constructor(x = [1, 2, 3, 4], y = [1, 2, 3, 4], alpha = 0.05) {

        this.arrX = x;
        this.arrY = y;
        this.alpha = alpha;
        [...this.sortedX] = this.arrX;
        this.sortedX.sort((a, b) => a - b ); 

        this.statPearson;
        this.statA0;
        this.statA1;
        this.pearsonQuantile;
        this.aQuantile;
        this.minX;
        this.maxX;

        this.xAverage = this.getAverage(this.arrX);
        this.yAverage = this.getAverage(this.arrY);
        this.xyAverage = this.getAverage(this.arrX, this.arrY);
        this.xDisp = this.getDisp(this.arrX);
        this.yDisp = this.getDisp(this.arrY);
        this.pearson = this.getPearsonCorrCoef();
        this.pearsonInterval = this.getPearsonInterval(this.alpha);
        this.pearsonSignificanse = this.significansePearsonTest(this.alpha);
        this.a1 = this.getParamA1();
        this.a0 = this.getParamA0();
        this.remDisp = this.remainsDisp();
        this.a0Disp = this.getA0Disp();
        this.a1Disp = this.getA1Disp();
        this.a0Interval = this.getInterval(this.a0, this.a0Disp);
        this.a1Interval = this.getInterval(this.a1, this.a1Disp);
        let signA = this.significanseATest();
        this.a0Significanse = signA[0];
        this.a1Significanse = signA[1];
        this.calcMinMaxX();
        this.regressionInterval = this.getRegressionInterval();
        this.predictionInterval = this.getPredictionInterval();
        this.determinationCoef = this.getDet();
        this.remainsArr = this.getRemArr();
        this.regArr = this.regCalc();
    }

    regCalc(){
        let arr = [];
        for(let i = 0; i<this.arrX.length; i++){
            arr[i] = this.regressionFunction(this.arrX[i]);
        }
        return arr;
    }

    getRemArr(){
        let arr = [];
        for(let i = 0; i< this.arrY.length; i++){
            arr[i] = this.arrY[i] - this.regressionFunction(this.arrX[i]);
        }
        return arr;
    }

    getFStat() {
        return this.determinationCoef * (this.arrX.length - 3) / ((1 - this.determinationCoef) * 2);
    }
    
    getDet() {
        return Math.pow(this.pearson, 2);
    }

    getPredictionInterval() {
        let arr = [];
        for (let i = 0; i < this.sortedX.length; i++) {
            arr[i] = this.getInterval(this.regressionFunction(this.sortedX[i]), this.remDisp);
        }
        return arr;
    }

    regressionDisp(x) {
        return this.remDisp / this.arrX.length + this.a1Disp * Math.pow(x - this.xAverage, 2);
    }

    getRegressionInterval() {
        let arrTmp = [];
        for (let i = 0; i < this.arrX.length; i++) {
            let tmp = this.getInterval(this.regressionFunction(this.sortedX[i]), this.regressionDisp(this.sortedX[i]));
            arrTmp[i] = tmp;
        }
        return arrTmp;
    }

    significanseATest() {
        this.statA0 = this.a0 / Math.sqrt(this.a0Disp);
        this.statA1 = this.a1 / Math.sqrt(this.a1Disp);
        this.aQuantile = Quantile.getTQuantile(this.alpha, this.arrX.length);

        let flag0 = (+Math.abs(this.statA0)) > (+this.aQuantile) ? false : true;
        let flag1 = (+Math.abs(this.statA1)) > (+this.aQuantile) ? false : true;
        console.log(flag0, flag1);
        return [flag0, flag1];
    }

    getInterval(a, d) {
        let q = Quantile.getTQuantile(this.alpha, this.arrX.length - 2);
        let up = a + q * Math.sqrt(d);
        let down = a - q * Math.sqrt(d);
        return [down, up];
    }

    calcMinMaxX() {
        let min = (+this.arrX[0]);
        let max = (+this.arrX[0]);
        for (let i = 1; i < this.arrX.length; i++) {
            if ((+this.arrX[i]) < (+min)) {
                min = (+this.arrX[i]);
            }
            if ((+this.arrX[i]) > (+max)) {
                max = (+this.arrX[i]);
            }
        }
        this.minX = min;
        this.maxX = max;
    }

    getA1Disp() {
        return Math.pow(this.xAverage, 2) / (this.arrX.length * this.xDisp);
    }

    getA0Disp() {
        return this.remDisp * (1 / this.arrX.length + Math.pow(this.xAverage, 2) / (this.arrX.length * this.xDisp));
    }

    remainsDisp() {
        let sum = 0;
        for (let i = 0; i < this.arrX.length; i++) {
            sum += Math.pow(this.arrY[i] - this.regressionFunction(this.arrX[i]), 2);
        }
        return sum / (this.arrX.length - 2);
    }

    getPearson() {
        return this.pearson;
    }

    regressionFunction(x) {
        return this.a0 + this.a1 * x;
    }

    getParamA0() {
        return this.yAverage - this.a1 * this.xAverage;
    }

    getParamA1() {
        return (this.pearson * this.yDisp) / this.xDisp;
    }

    getAverage(x, y) {
        let sum = 0;
        if (y == undefined) {
            for (let i = 0; i < x.length; i++) {
                sum += (+x[i]);
            }
            console.log('pisos');
            return sum / x.length;
        }
        for (let i = 0; i < x.length; i++) {
            sum += x[i] * y[i];
        }
        return sum / x.length;
    }

    getDisp(arr) {
        let sum = 0;
        let average = this.getAverage(arr);
        for (let i = 0; i < arr.length; i++) {
            sum += Math.pow(arr[i] - average, 2);
        }
        return Math.sqrt(sum / arr.length);
    }

    getPearsonCorrCoef() {
        return (this.xyAverage - (this.xAverage * this.yAverage)) / (this.xDisp * this.yDisp);
    }

    getPearsonInterval(alpha) {
        let r = this.pearson;
        let u = Quantile.getUQuantile(alpha);
        let rMin = r + (r * (1 - Math.pow(r, 2))) / (2 * this.arrX.length) - u * (1 - Math.pow(r, 2)) / Math.sqrt(this.arrX.length - 1);
        let rMax = r + (r * (1 - Math.pow(r, 2))) / (2 * this.arrX.length) + u * (1 - Math.pow(r, 2)) / Math.sqrt(this.arrX.length - 1);
        return [rMin, rMax];
    }

    comparisonTwoPearsonCoef(r1, r2, n1, n2) {
        let z1 = Math.log((1 + r1) / (1 - r1)) / 2;
        let z2 = Math.log((1 + r2) / (1 - r2)) / 2;
        let u = (z1 - z2) / Math.sqrt(1 / (n1 - 3) + 1 / (n2 - 3));
        return Math.abs(u) <= Quantile.getUQuantile(alpha) ? true : false;
    }

    significansePearsonTest(alpha) {
        let r = this.pearson;
        this.statPearson = (r * Math.sqrt(this.arrX.length - 2)) / Math.sqrt(1 - Math.pow(r, 2));
        this.pearsonQuantile = Quantile.getTQuantile(alpha, this.arrX.length - 2);
        return Math.abs(this.statPearson) > this.pearsonQuantile ? false : true;
    }

    getArrWithoutZero(arr) {
        let tmpArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] != 0) {
                tmpArr.push(arr[i]);
            }
        }
        return tmpArr;
    }

    getRankArr(arr) {
        let tmpArr = [];
        let j = 1;
        let k = 0;

        for (let i = 0; i < arr.length; i++) {
            if ((i + 1 != arr.length) && (arr[i + 1] == arr[i])) {
                j++;
                continue;
            }
            for (let l = k; l <= i; l++) {
                tmp[l] = arr[l] / j;
            }
            k = i + 1;
        }
        return tmpArr;
    }
}

module.exports = {
    Analys: Anal
}