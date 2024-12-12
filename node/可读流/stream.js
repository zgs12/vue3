const fs = require('fs')
const path = require('path')
const ReadStream = require('./ReadStream')

const rs = new ReadStream(path.resolve(__dirname, './name.txt'), {
    // const rs = fs.createReadStream(path.resolve(__dirname, './name.txt'), {
    flags: 'r',
    encoding: 'utf-8',
    fd: null,
    mode: 0o666,
    autoClose: true,
    emitClose: true,
    start: 0,
    highWaterMark: 3
})

rs.on('error', function (err) {
    console.log('出错', err)
})

rs.on('open', function (fd) {
    console.log(fd)
})
rs.on('data', function (data) {
    console.log(data)
    rs.pause()
})
rs.on('end', function () {
    console.log('读取结束')
})
rs.on('close', function () {
    console.log('关闭')
})

setInterval(() => {
    rs.resume()
}, 500)

//解决了 readFile的问题，可以按需读取
//用法简单(特点是异步的，非阻塞)
//错误处理 on('error')
//可读流 两个常用的方法 on('data')on('end')，两个不常用的rs.pause() rs.resume()，只有文件里面才有的方法 on('apen') on('close')