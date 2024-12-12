//buffer 的声明方式 (声明内存的,声明出来的结果是引用类型的)
//大小代表的是内存大小,再声明的过程中需要给定长度
// console.log(Buffer.alloc(3));//node中操作文件的单位是字节 不是位
// console.log(Buffer.from("中文"));// 会将这个内容直接转化成二进制来存放
// console.log(Buffer.from("中文"), toString());// tostring 方法 可以将二进制进行转化成其他格式
// console.log(Buffer.from([1, 2, 3, 4, 5, 100]));//基本不用,指定buffer的数据

// 文件的拼接和处理
// 接受一段段的数据,在后端拼接好存储起来
// 请求发送过来 tcp(分段传输)
let b1 = Buffer.from("你好");
let b2 = Buffer.from("世界");
// buffer没有数组一样的方法 但是有索引
Buffer.prototype.copy = function (targetBuffer, targetStart, sourceStart = 0, sourceEnd = this.length) {
    for (let i = 0; i < sourceEnd - sourceStart; i++) {
        targetBuffer[targetStart + i] = this[sourceStart + i]
    }
}

//java 声明一个更大的buffer 把他俩放进去
// let b3 = Buffer.alloc(12);
// b1.copy(b3, 0, 0, 6);
// b2.copy(b3, 6, 0, 6);
// console.log(b3.toString());

// console.log(b1.length) //6
Buffer.concat = function (
    list,
    totalLength = list.reduce((memo, current) => memo + current.length, 0)
) {
    const buffer = Buffer.alloc(totalLength);
    let offset = 0;
    list.forEach(item => {
        item.copy(buffer, offset);
        offset += item.length;
    })
    console.log(totalLength)
    return buffer
}
const b3 = Buffer.concat([b1, b2]);
console.log(b3.toString());

// let b4 = Buffer.from([1, 2, 3, 4]);
// let b5 = b4.slice(0, 1);
// 浅拷贝
// b5[0] = 100;
// console.log(b4);
// 可以截取但是 截取的内容依旧是原来buffer的内容, 引用类型的问题
// 缓存的时候用的buffer不能是同一个我们将每次的结果缓存起来

// 对二进制数据的分割 文件格式 formData
let buf4 = Buffer.from("你好爱你好爱你好爱你好");//[xx，xx,xx，xx]
Buffer.prototype.split = function (sep) {
    sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep);
    let arr = [];
    let offset = 0;
    let idx = 0;
    while ((idx = this.indexOf(sep, offset)) !== -1) {
        arr.push(this.slice(offset, idx));
        offset = idx + sep.length;
    }
    arr.push(this.slice(offset));
    return arr
}
buf4.split("爱")


//  ----XXXXXX----
// name='хххх'' xхxx=xxx
// data....字符串乱码问题
//  ----XXXXXX----
// name=''xxxх"’ xxxx=xxx
// data...。字符串乱码问题
// buffer中的常用方法 concat / tostring()/slice()buffer中的常用方法 自己封装splt
//处理数据的时候 一定要统一转成buffer在处理
