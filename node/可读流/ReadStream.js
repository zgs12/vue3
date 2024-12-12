const fs = require('fs')
const EventEmitter = require('events')
const path = require('path')

class ReadStream extends EventEmitter {
    constructor(path, options) {
        super()
        this.path = path
        this.flags = options.flags || 'r'
        this.encoding = options.encoding || null
        this.fd = options.fd || null
        this.mode = options.mode || 0o666
        this.autoClose = options.autoClose || true
        this.emitClose = options.emitClose || true
        this.start = options.start || 0
        this.highWaterMark = options.highWaterMark || 64 * 1024
        this.flowing = false
        this.offset = this.start
        this.open()
        this.on('newListener', (type) => {
            //用户监听了data事件
            if (type === 'data') {
                this.flowing = true
                this.read() //有fd后开始读取
            }
        })
    }
    destory(err) {
        if (typeof this.fd === 'number') {
            if (this.autoClose) {
                fs.close(this.fd, () => {
                    if (this.emitClose) {
                        this.emit('close')
                    }
                })
            }
        }
        if (err) {
            this.emit('error', err)
        }
    }
    pause() {
        this.flowing = false
    }
    resume() {
        if (!this.flowing) {
            this.flowing = true
            this.read()
        }
    }
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if (err) {
                this.destory()
            } else {
                this.fd = fd
                this.emit('open', fd)
            }
        })
    }
    read() {
        if (typeof this.fd !== 'number') {
            return this.once('open', this.read.bind(this))
        }
        let buf = Buffer.alloc(this.highWaterMark)
        let offset = 0
        fs.read(this.fd,
            buf,
            0,
            this.highWaterMark,
            this.offset,
            (err, bytesRead) => {
                if (err) {
                    return this.destory(err)
                }
                if (bytesRead) {
                    this.offset += bytesRead
                    this.emit('data', buf.slice(0, bytesRead))
                    if (this.flowing) {
                        this.read()
                    }
                } else {
                    this.emit('end')
                    this.destory()
                }
            })
    }
}

module.exports = ReadStream