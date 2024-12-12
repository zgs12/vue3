const fs = require("fs");
const path = require("path");
//1.读取文件文件不存在会报错
//2.写入文件的时候 文件不存在 会创建这个文件，如果文件中有内容会清空文件内容
// fs.readFile(path.resolve(__dirname, "name.txt"), function (err, data) {
//     if (err) return console.log(err);
//     //这种模式如果文件内容 是非常的大，不能采用此操作
//     fs.writeFile(path.resolve(__dirname, "copy.txt"), data, function (err) {
//         if (err) return console.log(err);
//         console.log("写入成功")
//     })
// });

// 读取一部分操作一部分，流水线的过程(流)
//fs 中提供了 可以按照需要去读取，而不是直接读取整个文件的方式//用起来会比较麻烦
const buf = Buffer.alloc(3);//我希望一次读取3个字节
//flags:表示打开文件我们要干什么?
//r->read 如果文件不存在会报错的 fs.readFile
//r+ 在读取的基础上能写入，如果文件不存在会报错的
//w write 要写入内容,如果文件不存在会创建，如果有内容会清空文件 fs.writeFile
//w+ 在写入的基础上能读取，如果文件不存在会创建，如果有内容会清空文件
//a append 追加写入，如果文件不存在会创建，如果有内容会在文件末尾追加 fs.appendFile
// fs.open(path.resolve(__dirname, "name.txt"), "r", function (err, fd) {
//     // fd file-descriptor 文件描述符  
//     console.log(fd)
//     // 将这个数据写入到buf中 0:从buf的哪个位置开始写入 3:写入多少个字节 0:从文件中的哪个位置开始读取
//     fs.read(fd, buf, 0, 3, 0, function (err, bytesRead, buffer) {
//         //bytesRead 真正读取的个数，buffer 读取到的内容
//         console.log(bytesRead, buffer.toString())
//         // mode rwx  r-x   r-x
//         //      用户  组   其他
//         // 读取文件的时候，默认的权限是 0o666  8进制 =》10进制 438
//         // 写入文件的时候，默认的权限是 0o666
//         // 1 执行 2 写入 4 读取

//         fs.open(path.resolve(__dirname, "copy.txt"), "w", 0o666, function (err, wfd) {
//             // 将buf中的数据写入到文件中 0:从buf的哪个位置开始写入 3:写入多少个字节 0:从文件中的哪个位置开始写入
//             fs.write(wfd, buf, 0, bytesRead, 0, function (err, bytesWritten, buffer) {
//                 console.log(bytesWritten, buffer.toString())
//             })
//         })
//     })

// })

fs.open(path.resolve(__dirname, "name.txt"), "r", function (err, fd) {
    fs.open(path.resolve(__dirname, "copy.txt"), "w", 0o666, function (err, wfd) {
        let readOffset = 0;
        let writeOffset = 0;
        (function next() {
            fs.read(fd, buf, 0, buf.length, readOffset, function (err, bytesRead, buffer) {
                readOffset += bytesRead;
                fs.write(wfd, buf, 0, bytesRead, writeOffset, function (err, bytesWritten, buffer) {
                    writeOffset += bytesWritten;
                    console.log(bytesWritten, buffer.toString())
                    if (bytesRead < buf.length) {
                        return console.log("读取完成")
                    }
                    next()
                })
            })
        }())
    })

})