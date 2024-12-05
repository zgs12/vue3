// packages/shared/src/index.ts
var isObject = (val) => val !== null && typeof val === "object";
var isFunction = (val) => typeof val === "function";

// packages/reactivity/src/effectScope.ts
var activeEffectScope = null;
var EffectScope = class {
  constructor(detached) {
    this.active = true;
    this.effects = [];
    this.parent = null;
    if (!detached && activeEffectScope) {
      activeEffectScope.scopes || (activeEffectScope.scopes = []).push(this);
    }
  }
  run(fn) {
    if (this.active) {
      try {
        this.parent = activeEffectScope;
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = this.parent;
        this.parent = null;
      }
    }
  }
  stop() {
    if (this.active) {
      this.active = false;
      const { effects } = this;
      for (let i = 0; i < effects.length; i++) {
        effects[i].stop();
      }
      if (this.scopes) {
        for (let i = 0; i < this.scopes.length; i++) {
          this.scopes[i].stop();
        }
      }
    }
  }
};
function recordEffectScope(effect2) {
  if (activeEffectScope && activeEffectScope.active) {
    activeEffectScope.effects.push(effect2);
  }
}
function effectScope(detached = false) {
  return new EffectScope(detached);
}

// packages/reactivity/src/effect.ts
var activeEffect = void 0;
function cleanupEffect(effect2) {
  for (let i = 0; i < effect2.deps.length; i++) {
    let dep = effect2.deps[i];
    dep.delete(effect2);
  }
  effect2.deps.length = 0;
}
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.parent = void 0;
    this.active = true;
    this.deps = [];
    recordEffectScope(this);
  }
  //记录依赖
  run() {
    if (!this.active) {
      return this.fn();
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      cleanupEffect(this);
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = void 0;
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
};
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep) {
  let shouldTrace = !dep.has(activeEffect);
  if (shouldTrace) {
    dep.add(activeEffect);
    console.log(dep, "dep");
    activeEffect.deps.push(dep);
  }
}
function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);
  triggerEffects(dep);
}
function triggerEffects(dep) {
  if (dep) {
    const effect2 = [...dep];
    effect2 && effect2.forEach((effect3) => {
      if (effect3 !== activeEffect) {
        if (effect3.scheduler) {
          effect3.scheduler();
        } else {
          effect3.run();
        }
      }
    });
  }
}

// packages/reactivity/src/handler.ts
var mutableHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    if (isObject(target[key])) {
      return reactive(target[key]);
    }
    const res = Reflect.get(target, key, receiver);
    track(target, key);
    return res;
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];
    const r = Reflect.set(target, key, value, receiver);
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return r;
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive";
  return ReactiveFlags2;
})(ReactiveFlags || {});
function isReactive(target) {
  return !!(target && target["__v_isReactive" /* IS_REACTIVE */]);
}
function reactive(target) {
  if (!isObject(target)) {
    return target;
  }
  const existProxy = reactiveMap.get(target);
  if (existProxy) return existProxy;
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}

// packages/reactivity/src/computed.ts
var noop = () => {
};
var ComputedRefImpl = class {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      this._dirty = true;
      triggerEffects(this.dep);
    });
  }
  // 类的属性访问器 类似defineProperty
  get value() {
    if (activeEffect) {
      trackEffects(this.dep || (this.dep = /* @__PURE__ */ new Set()));
    }
    if (this._dirty) {
      this._value = this.effect.run();
      this._dirty = false;
    }
    return this._value;
  }
  set(newValue) {
    this.setter(newValue);
  }
};
function computed(getterOrOptions) {
  let getter;
  let setter;
  getter = isFunction(getterOrOptions) ? getterOrOptions : getterOrOptions.get;
  setter = isFunction(getterOrOptions) ? noop : getterOrOptions.set;
  return new ComputedRefImpl(getter, setter);
}

// packages/reactivity/src/watch.ts
function traverse(value, s = /* @__PURE__ */ new Set()) {
  if (!isObject(value)) return value;
  if (s.has(value)) return value;
  s.add(value);
  for (const key in value) {
    traverse(value[key], s);
  }
  return value;
}
function doWatch(source, cb, { immediate } = {}) {
  let getter;
  if (isReactive(source)) {
    getter = () => traverse(source);
  } else if (isFunction(source)) {
    getter = source;
  }
  let oldValue;
  let cleanup;
  const onCleanup = (userCleanup) => {
    cleanup = userCleanup;
  };
  const job = () => {
    if (cb) {
      let newValue = effect2.run();
      if (cleanup) {
        cleanup();
      }
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    } else {
      effect2.run();
    }
  };
  const effect2 = new ReactiveEffect(getter, job);
  if (immediate) {
    job();
  }
  oldValue = effect2.run();
}
function watch(source, cb, options) {
  doWatch(source, cb, options);
}
function watchEffect(cb, options) {
  doWatch(cb, null, options);
}

// packages/reactivity/src/ref.ts
var RefImpl = class {
  // 标识是一个ref对象
  constructor(rawValue) {
    this.rawValue = rawValue;
    this.deps = void 0;
    this.__v_isRef = true;
    this._value = toReactive(rawValue);
  }
  get value() {
    if (activeEffect) {
      trackEffects(this.deps || (this.deps = /* @__PURE__ */ new Set()));
    }
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this._value = toReactive(newValue);
      this.rawValue = newValue;
      triggerEffects(this.deps);
    }
  }
};
function ref(value) {
  return new RefImpl(value);
}
function toReactive(value) {
  isObject(value) ? reactive(value) : value;
}
var ObjectRefImpl = class {
  constructor(_object, _key) {
    this._object = _object;
    this._key = _key;
    this.__v_isRef = true;
  }
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
};
function toRef(value, key) {
  return new ObjectRefImpl(value, key);
}
function toRefs(object) {
  const res = {};
  for (const key in object) {
    res[key] = toRef(object, key);
  }
  return res;
}
function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      let v = Reflect.get(target, key, receiver);
      return v.__v_isRef ? v.value : v;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  });
}
function isRef(r) {
  return !!(r && r.__v_isRef);
}
export {
  EffectScope,
  ReactiveEffect,
  ReactiveFlags,
  activeEffect,
  activeEffectScope,
  computed,
  effect,
  effectScope,
  isReactive,
  isRef,
  proxyRefs,
  reactive,
  recordEffectScope,
  ref,
  toRef,
  toRefs,
  track,
  trackEffects,
  trigger,
  triggerEffects,
  watch,
  watchEffect
};
//# sourceMappingURL=reactivity.js.map
