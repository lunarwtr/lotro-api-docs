const { createCanvas } = require('canvas')
const fs = require('fs');
const colors = require('./colors.json');

Object.entries(colors).forEach((e, i) => {
    const [color, c] = e;
    const can = createCanvas(20, 20);
    var ctx = can.getContext('2d');
    const style = `rgba(${Math.ceil(255*c.R.value)},${Math.ceil(255*c.G.value)},${Math.ceil(255*c.B.value)},${c.A.value})`;
    ctx.beginPath()
    ctx.strokeStyle = style;
    ctx.fillStyle = style;
    ctx.arc(10, 10, 10, 0, Math.PI * 2, false);
    ctx.fill();
    console.log(`${color}(${style})`)
    
    const out = fs.createWriteStream(__dirname + `/images/${color}.png`)
    const stream = can.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log(`The ${color}(${style}) PNG file was created.`))
});