console.log(global.Buffer)



//base64编码，base32编码
//加密(将结果进行加密后按照特定秘钥可以解密)!== 编码(按照规则来算，有编码规范大家都可以按照规范来做)= 摘要(不可逆
//英文26个字母大写26个数字10个+/64个//网上传输数据 传递中文会出现乱码问题，base64
// 汉字?位 字节呢?
// console.log(1*2**7-1);// 127
//gb2312只支持简体中文，2个字节来表示
// console.log(128*255);// 32640
//gbk 尽可能去增加编码 两个字节来表示一个汉字
// gb18030

// Unicode 整个将字符 重排，没有被推广
//别的国家编码?
//utf8 编码成了 可变字节长度 汉字就是1个汉字三个字节字符串 1个字节
//gb一个汉字2个字节 utf 一个汉字三个字节(本质上就是按照规则进行了编码了而已)
// node中默认不支持gb字体 一个汉字就是三个字节
console.log(Buffer.from("帅"));//0xe5 0xb8 0x85

console.log(0xe5.toString(2))
console.log(0xb8.toString(2))
console.log(0x85.toString(2))
// 00111001 00011011 00100010 00000101
console.log(0b00111001.toString())
console.log(0b00011011.toString())
console.log(0b00100010.toString())
console.log(0b00000101.toString())

let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
console.log(str[57]+str[27]+str[34]+str[5])

console.log(0x5E05.toString(2))
console.log(Buffer.from("帅").toString("base64"))


