const EventEmitter = require("events");

class Person extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }
    sayHello() {
        this.emit("hello");
    }
}
let person1 = new Person("张三");
const set = new Set();
let waitting = false
person1.on("newListener", function (eventName, listener) {
    if (!set.has(eventName)) {
        set.add(eventName);
    }
    if (waitting) {
        return
    }
    waitting = true;
    // 异步执行 只执行一次
    process.nextTick(() => {
        for (let eventName of set) {
            person1.emit(eventName);
        }
        waitting = false;
    })

})
person1.once("hello", function () {
    console.log("hello1");
})
person1.on("hello", function () {
    console.log("hello2");
})
person1.on("hello", function () {
    console.log("hello3");
})

