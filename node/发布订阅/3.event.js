const EventEmitter = require('./EventEmitter')

class Person extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }
    sayHello() {
        this.emit("hello");
    }
}
let person1 = new Person("张三")
function o1() {
    console.log("hello1");
}
person1.on("newListener",function(eventName) {
    console.log(eventName)
})
person1.once("hello",o1)
person1.on("hello", function () {
    console.log("hello2");
})
person1.on("hello", function () {
    console.log("hello3");
})
person1.off("hello",o1)
person1.sayHello();
