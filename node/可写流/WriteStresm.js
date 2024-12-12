const EventEmitter = require('events').EventEmitter;
const { log } = require('console');
const fs = require('fs');

class WriteStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.path = path;
        this.options = options;
        this.autoClose = options.autoClose || true;
        this.emitClose = options.emitClose || true;
        this.flag = options.flag || 'w';
        this.start = options.start || 0;
        this.encoding = options.encoding || 'utf8';
        this.highWaterMark = options.highWaterMark || 16 * 1024;
        this.writing = false;
        this.offset = this.start
        this.cached = [];
        this.len = 0;
        this.open()
    }
    open() {
        fs.open(this.path, this.flag, (err, fd) => {
            this.fd = fd;
            this.emit('open', fd);
        })
    }
    clear() {
        let buffer = this.cached.shift();
        if (buffer) {
            this._write(buffer.chunk, buffer.encoding, buffer.clearBuffer);
        } else {
            this.writing = false;
            if (this.needDrain) {
                this.emit('drain')
            }
        }
    }
    write(chunk, encoding = this.encoding, callback = () => { }) {
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
        this.len += chunk.length;
        const clearBuffer = () => {
            callback()
            this.clear()
        }
        // 判断当前写入的数据是否大于highWaterMark
        this.needDrain = this.len >= this.highWaterMark;
        if (this.writing) {
            this.cached.push({
                chunk,
                encoding,
                clearBuffer
            })
        } else {
            this.writing = true;
            this._write(chunk, encoding, clearBuffer);
        }
        return this.needDrain ? false : true;
    }
    _write(chunk, encoding, callback) {
        if (typeof this.fd !== "number") {
            return this.once('open', () => this._write(chunk, encoding, callback));
        }

        fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, bytesWritten) => {
            this.offset += bytesWritten;
            this.len -= bytesWritten;
            callback();
        })
    }
}

module.exports = WriteStream