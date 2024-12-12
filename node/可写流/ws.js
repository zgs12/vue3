const fs = require('fs')
const path = require('path')
const WriteStream = require('./WriteStresm')

const ws = new WriteStream(path.resolve(__dirname, './name.txt'), {
    // const ws = fs.createWriteStream(path.resolve(__dirname, './name.txt'), {
    flags: 'w',
    autoClose: true,
    emitClose: true,
    encoding: 'utf8',
    start: 0,
    highWaterMark: 2
})
ws.on('open', (fd) => {
    console.log('open', fd)
})
let flag = ws.write('hh', (err) => {
    console.log('write', err)
})
console.log(flag, 'flag')
flag = ws.write('h', (err) => {
    console.log('write', err)
})
console.log(flag, 'flag')
flag = ws.write('h', (err) => {
    console.log('write', err)
})
console.log(flag, 'flag')
// setTimeout(() => {
//     flag = ws.write('88h', (err) => {
//         console.log('write', err)
//     })
//     console.log(flag, 'flag')
// }, 1500)
ws.on('drain', function () {
    console.log('drain')
})
// ws.end('finish')
ws.on('close', () => {
    console.log('close')
})


//可写流的方法 write()end() 可以有一个on('drain')事件搭配使用