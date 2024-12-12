class obj {
    constructor() {
        this.name = "hello"
    }
    say(cb) {
        cb()
    }
}
let b = this
let obj1 = new obj()
obj1.say(function(){
    console.log(this==global)
})