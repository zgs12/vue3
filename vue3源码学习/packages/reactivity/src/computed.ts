import { isFunction } from "@vue/shared";
import { activeEffect, ReactiveEffect, trackEffects, triggerEffects } from "./effect";
const noop = () => { }
class ComputedRefImpl {
    dep = undefined
    effect
    __v_isRef = true
    _dirty = true
    _value
    constructor(public getter, public setter) {
        // 这里不能使用effect(()=>{})，因为effect.run()会立即执行一次，而computed需要的是惰性执行
        this.effect = new ReactiveEffect(getter, () => {
            this._dirty = true
            triggerEffects(this.dep)
        })
    }
    // 类的属性访问器 类似defineProperty
    get value() {
        if (activeEffect) {
            // 收集依赖
            trackEffects(this.dep || (this.dep = new Set()))
        }
        if (this._dirty) {
            this._value = this.effect.run()
            this._dirty = false
        }
        return this._value
    }
    set(newValue) {
        this.setter(newValue)
    }
}
export function computed(getterOrOptions) {
    // 根据传入的参数类型，决定调用getter还是options
    let getter
    let setter
    getter = isFunction(getterOrOptions) ? getterOrOptions : getterOrOptions.get
    setter = isFunction(getterOrOptions) ? noop : getterOrOptions.set
    return new ComputedRefImpl(getter, setter)
}