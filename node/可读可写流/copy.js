const fs = require('fs')
const path = require('path')

const rs = fs.createReadStream(path.resolve(__dirname, './name.txt'), {
    highWaterMark: 3
})

const ws = fs.createWriteStream(path.resolve(__dirname, './name2.txt'), {
    highWaterMark: 1
})
rs.pipe(ws)
// rs.on('data', (chunk) => {
//     const flag = ws.write(chunk)
//     console.log(chunk)
//     if (!flag) {
//         rs.pause()
//     }
// })
// ws.on('drain', () => {
//     rs.resume()
// })
// rs.on('end', () => {
//     rs.close()
//     ws.end()
// })