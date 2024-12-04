import { isObject } from "@vue/shared"
import { reactive } from "./reactive"
import { activeEffect, trackEffects, triggerEffects } from "./effect"

class RefImpl {
    deps = undefined
    _value
    __v_isRef = true // 标识是一个ref对象

    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }
    get value() {
        if (activeEffect) {
            trackEffects(this.deps || (this.deps = new Set()))
        }
        return this._value
    }
    set value(newValue) {
        if (newValue !== this.rawValue) {
            this._value = toReactive(newValue)
            this.rawValue = newValue
            triggerEffects(this.deps)
        }
    }

}
export function ref(value) {
    return new RefImpl(value)
}
function toReactive(value) {
    isObject(value) ? reactive(value) : value

}

class ObjectRefImpl {
    __v_isRef = true
    constructor(public _object, public _key) {

    }
    get value() {
        return this._object[this._key]
    }
    set value(newValue) {
        this._object[this._key] = newValue
    }
}
export function toRef(value, key) {
    return new ObjectRefImpl(value, key)
}

export function toRefs(object) {
    const res = {}
    for (const key in object) {
        res[key] = toRef(object, key)
    }
    return res
}

export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key, receiver) {
            return toRef(target, key)
        },
        set(target, key, value, receiver) {
            target[key] = value
            return true
        }
    })
}