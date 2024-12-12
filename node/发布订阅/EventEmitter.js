function EventEmitter() {
    this.events = {};
}

EventEmitter.prototype.on = function (eventName, callback) {
    if (!this.events) {
        this.events = {};
    }
    if (eventName !== 'newListener') {
        this.emit('newListener', eventName);
    }
    if (!this.events[eventName]) {
        this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
}
EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this.events) {
        this.events = {};
    }
    if (this.events[eventName]) {
        this.events[eventName].forEach(callback => {
            callback(...args);
        });
    }
}
EventEmitter.prototype.once = function (eventName, callback) {
    const onceCallback = (...args) => {
        callback(...args);
        this.off(eventName, onceCallback);
    }
    onceCallback.l = callback
    this.on(eventName, onceCallback);
}
EventEmitter.prototype.off = function (eventName, callback) {
    if (!this.events) {
        this.events = {};
    }
    if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter(cb => ((cb !== callback) && (cb.l !== callback)));
    }
}
module.exports = EventEmitter;