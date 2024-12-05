let originalArray = [1, 2, 3,8];
 
let proxyArray = new Proxy(originalArray, {
    get: function(target, prop, receiver) {
        console.log(`Getting ${prop}`);
        return Reflect.get(target, prop, receiver);
    },
    set: function(target, prop, value, receiver) {
        originalArray.push(1);
        console.log(`Setting ${prop} to ${value}`);
        return Reflect.set(target, prop, value, receiver);
    }
});
proxyArray.push(1)
