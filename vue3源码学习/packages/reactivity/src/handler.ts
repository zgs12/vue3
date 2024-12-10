import { isObject } from "@vue/shared";
import {  track, trigger } from "./effect"
import { activeEffect } from "./effect";
import { reactive, ReactiveFlags } from "./reactive";
export const mutableHandlers = {
    get(target, key, receiver) {
        // 拦截获取属性
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        if ( isObject(target[key])) {
            return reactive(target[key])
        }
        // Reflect用来改变this指向
        const res = Reflect.get(target, key, receiver)
        track(target, key)
        return res
    },
    set(target, key, value, receiver) {
        debugger
        let oldValue = target[key]
        // 拦截设置属性
        const r = Reflect.set(target, key, value, receiver)
        if (oldValue !== value) {
            trigger(target, key, value, oldValue)
        }
        return r
    }
}