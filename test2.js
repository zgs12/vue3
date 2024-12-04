const person = {
    nom: "John",
    age: 30,
    ville: "New York",
}
const proxy = new Proxy(person, {
    get: function(target, property) {
        if (property === 'age') {
            return target[property] + 1;
        }
        return target[property];
    },
    set: function(target, property, value) {
        
    }
})

for (let key in proxy) {
    console.log(key, proxy[key]);
    
}