class Quantile {
    static getUQuantile(a) {
        const C0 = 2.515517;
        const C1 = 0.802853;
        const C2 = 0.010328;
        const D1 = 1.432788;
        const D2 = 0.1892659;
        const D3 = 0.001308;
        let t = Math.sqrt(-2 * Math.log(a));
        let res = t - (C0 + C1 * t + C2 * Math.pow(t, 2)) / (1 + D1 * t + D2 * Math.pow(t, 2) + D3 * Math.pow(t, 3));
        return res;
    }

    static getTQuantile(a, v) {


        let u = this.getUQuantile(a);
        let g1 = (Math.pow(u, 3) + u) / 4;
        let g2 = (5 * Math.pow(u, 2) + 16 * Math.pow(u, 3) + 3 * u) / 96;
        let g3 = (3 * Math.pow(u, 7) + 19 * Math.pow(u, 5) + 17 * Math.pow(u, 3) - 15 * u) / 384;
        let g4 = (79 * Math.pow(u, 9) + 779 * Math.pow(u, 7) + 1482 * Math.pow(u, 5) - 1920 * Math.pow(u, 3) - 945 * u) / 92160;
        let res = u + g1 / v + g2 / Math.pow(v, 2) + g3 / Math.pow(v, 3) + g4 / Math.pow(v, 4);
        return res;
    }

    static getXQuantile(a, v) {
        return v * Math.pow((1 - 2 / (9 * v) + this.getUQuantile(a) * Math.sqrt(2 / (9 * v))), 3);
    }

    static getFQuantile(p,v1,v2){
        
    }
}

module.exports = {
    Quantile: Quantile
}