import { isFunction, isObject } from "@vue/shared";
import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
function traverse(value, s = new Set()) {
    if (!isObject(value)) return value
    if (s.has(value)) return value
    s.add(value)
    for (const key in value) {
        traverse(value[key], s)
    }
    return value
}

function doWatch(source, cb, { immediate } = {} as any) {

    let getter
    if (isReactive(source)) {
        // 深度监听
        getter = () => traverse(source)
    } else if (isFunction(source)) {
        // 深度监听
        getter = source
    }
    let oldValue
    let cleanup
    const onCleanup = (userCleanup) => {
        cleanup = userCleanup
    }
    const job = () => {
        //如果有cb 代表是watch API 没有意味着是watchEffect API
        if (cb) {
            let newValue = effect.run()
            if (cleanup) {
                cleanup()
            }
            cb(newValue, oldValue,onCleanup)
            oldValue = newValue
        } else {
            effect.run()
        }

    }
    const effect = new ReactiveEffect(getter, job)

    if (immediate) {
        job()
    }

    oldValue = effect.run()

}
export function watch(source, cb, options) {
    doWatch(source, cb, options)
}

export function watchEffect(cb, options) {
    doWatch(cb, null, options)
}