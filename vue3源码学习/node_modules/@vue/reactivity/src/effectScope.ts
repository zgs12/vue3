export let activeEffectScope = null

export class EffectScope {
    active = true
    effects = []
    parent = null
    scopes
    constructor(detached) {
        if (!detached && activeEffectScope) {
            activeEffectScope.scopes || (activeEffectScope.scopes = []).push(this)
        }

    }
    run(fn) {

        if (this.active) {
            try {
                this.parent = activeEffectScope
                activeEffectScope = this
                return fn()
            }
            finally {
                activeEffectScope = this.parent
                this.parent = null
            }
        }


    }

    stop() {
        if (this.active) {
            this.active = false
            const { effects } = this
            for (let i = 0; i < effects.length; i++) {
                effects[i].stop()
            }
            if (this.scopes) {
                for (let i = 0; i < this.scopes.length; i++) {
                    this.scopes[i].stop()
                }
            }
        }
    }
}
export function recordEffectScope(effect) {
    if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(effect)
    }
}

export function effectScope(detached = false) {
    return new EffectScope(detached)
}