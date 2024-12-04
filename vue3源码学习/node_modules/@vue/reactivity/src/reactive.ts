import { isObject } from "@vue/shared";
import { mutableHandlers } from "./handler";

const reactiveMap = new WeakMap()
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
export function isReactive(target) {
    return !!(target && target[ReactiveFlags.IS_REACTIVE])
}
export function reactive(target) {
    // 如果不是对象则直接返回 reactive只能处理对象
    if (!isObject(target)) {
        return target
    }
    // 如果已经被代理过则直接返回
    const existProxy = reactiveMap.get(target)
    if (existProxy) return existProxy

    // 标记对象已经被代理过
     
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }
    // 代理对象
    const proxy = new Proxy(target, mutableHandlers)
    reactiveMap.set(target, proxy)
    return proxy
}


