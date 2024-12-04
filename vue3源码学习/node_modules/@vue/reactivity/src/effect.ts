export let activeEffect = undefined
function cleanupEffect(effect) {
    for (let i = 0; i < effect.deps.length; i++) {

        let dep = effect.deps[i]
        dep.delete(effect)
    }
    effect.deps.length = 0
}
export class ReactiveEffect {
    constructor(private fn, private scheduler) { }
    parent = undefined
    active = true
    deps = [] //记录依赖
    run() {
        if (!this.active) {
            return this.fn()
        }
        try {
            this.parent = activeEffect
            activeEffect = this
            cleanupEffect(this)
            return this.fn()
        }
        finally {
            activeEffect = this.parent
            this.parent = undefined
        }
    }

    stop() {
        // 停止effect
        if (this.active) {
            cleanupEffect(this)
            this.active = false
        }
    }
}

export function effect(fn, options) {
    const _effect = new ReactiveEffect(fn, options?.scheduler)
    _effect.run()
    const runner = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}
const targetMap = new WeakMap()
export function track(target, key) {
    //让这个对象上的属性 记录这个activeEffect
    if (activeEffect) {
        //说明是在effect中使用的这个数据
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target, depsMap = new Map())
        }
        let dep = depsMap.get(key)
        if (!dep) {
            depsMap.set(key, dep = new Set())
        }
        trackEffects(dep)

    }
}
export function trackEffects(dep) {
    let shouldTrace = !dep.has(activeEffect)
    if (shouldTrace) {
        dep.add(activeEffect)
        console.log(dep, 'dep')
        activeEffect.deps.push(dep)
    }
}
export function trigger(target, key, newValue, oldValue) {
    //通过对象找到对应的属性 然后让effect执行
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        return
    }
    const dep = depsMap.get(key)
    triggerEffects(dep)

}

export function triggerEffects(dep) {
    if (dep) {
        const effect = [...dep]
        effect && effect.forEach(effect => {
            if (effect !== activeEffect) {
                if (effect.scheduler) {
                    effect.scheduler()
                } else {
                    effect.run()
                }
            }
        })
    }
}