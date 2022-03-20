const { createCanvas } = require('canvas')
const fs = require('fs');
var cf = require('color-functions');

/*
def step (r,g,b, repetitions=1):
    lum = math.sqrt( .241 * r + .691 * g + .068 * b )
    h, s, v = colorsys.rgb_to_hsv(r,g,b)
    h2 = int(h * repetitions)
    lum2 = int(lum * repetitions)
    v2 = int(v * repetitions)
    if h2 % 2 == 1:
        v2 = repetitions - v2
        lum = repetitions - lum
*/
function step(r,g,b, repetitions=1) {
    const lum = Math.sqrt( .241 * r + .691 * g + .068 * b )
    const {h, s, v} = cf.rgb2hsv(r,g,b)
    const h2 = Math.floor(h * repetitions)
    const lum2 = Math.floor(lum * repetitions)
    const v2 = Math.floor(v * repetitions)
    if (h2 % 2 === 1) {
        v2 = repetitions - v2;
        lum2 = repetitions - lum2;
    }
    return {h2, lum2, v2}
}

const colors = require('./colors.json');
const keys = Object.keys(colors).sort((a, b) => {
    var aa = colors[a],
    bb = colors[b],
    v1 = step(aa.R.value, aa.G.value, aa.B.value, 8),
    v2 = step(bb.R.value, bb.G.value, bb.B.value, 8);
    return - ( v1.h2 - v2.h2 || v1.lum - v2.lum || v1.v2 - v2.v2 );
});

const rainbow = createCanvas(keys.length, 20);
var rainbowCtx = rainbow.getContext('2d');
rainbowCtx.lineWidth = 1;

const rows = [];
keys.forEach((color, i) => {
    const c = colors[color];
    const can = createCanvas(20, 20);
    var ctx = can.getContext('2d');
    const style = `rgba(${Math.ceil(255*c.R.value)},${Math.ceil(255*c.G.value)},${Math.ceil(255*c.B.value)},${c.A.value})`;
    ctx.beginPath()
    ctx.strokeStyle = style;
    ctx.fillStyle = style;
    ctx.arc(10, 10, 10, 0, Math.PI * 2, false);
    ctx.fill();

    rainbowCtx.beginPath();
    rainbowCtx.strokeStyle = style;
    rainbowCtx.moveTo(i, 0);
    rainbowCtx.lineTo(i, 20);
    rainbowCtx.stroke();

    rows.push(`<tr><td style="color: ${style};">${color}</td><td><img src="${color}.png"/></td></tr>`)
    
    const out = fs.createWriteStream(__dirname + `/images/${color}.png`)
    const stream = can.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log(`The ${color}(${style}) PNG file was created.`))
});

const out = fs.createWriteStream(__dirname + `/images/rainbow.png`)
const rainbowStream = rainbow.createPNGStream()
rainbowStream.pipe(out);

var stream = fs.createWriteStream('images/index.html');
stream.once('open', function(fd) {
  var html = `<html>
    <body style="background-color: rgb(30, 30, 30); padding: 20px;">
    <table>
        ${ rows.join('\n') }
    </table>
    </body>
  </html>`;
  stream.end(html);
});