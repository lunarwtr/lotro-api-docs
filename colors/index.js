const { createCanvas } = require('canvas')
const fs = require('fs');
const colors = require('./colors.json');

const rows = [];
Object.keys(colors).sort().forEach((color, i) => {
    const c = colors[color];
    const can = createCanvas(20, 20);
    var ctx = can.getContext('2d');
    const style = `rgba(${Math.ceil(255*c.R.value)},${Math.ceil(255*c.G.value)},${Math.ceil(255*c.B.value)},${c.A.value})`;
    ctx.beginPath()
    ctx.strokeStyle = style;
    ctx.fillStyle = style;
    ctx.arc(10, 10, 10, 0, Math.PI * 2, false);
    ctx.fill();
    rows.push(`<tr><td style="color: ${style};">${color}</td><td><img src="${color}.png"/></td></tr>`)
    
    const out = fs.createWriteStream(__dirname + `/images/${color}.png`)
    const stream = can.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log(`The ${color}(${style}) PNG file was created.`))
});

var stream = fs.createWriteStream('images/index.html');
stream.once('open', function(fd) {
  var html = `<html>
    <body>
    <table>
        ${ rows.join('\n') }
    </table>
    </body>
  </html>`;
  stream.end(html);
});