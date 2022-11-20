import { extend } from "../shared";

let activeEffect
let shouldTrack

export class ReactiveEffect{
  private _fn: any;
  deps = []
  active = true // 提升性能，便面频繁执行stop
  onStop?: () => void
  public scheduler: Function | undefined

  constructor(fn, scheduler?: Function){
    this._fn = fn
    this.scheduler = scheduler
  }
  run(){
    if(!this.active){
      return this._fn()
    }
    // 应该收集
    shouldTrack = true
    activeEffect = this // 存放实例对象

    const result = this._fn()
    // reset
    shouldTrack = false
    return result
  }
  stop() {
    if(this.active){
      cleanEffect(this)
      if(this.onStop){
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanEffect(effect) {
  effect.deps.forEach((dep :any) => {
    dep.delete(effect)
  });
  effect.deps.length = 0
}
// 依赖收集

const targetMap = new Map()


export function track(target, key){

  if(!activeEffect) return
  if(!shouldTrack) return
  // target-->key-->dep
  // dep存放传递收集的依赖函数
  let depsMap = targetMap.get(target)
  // 如果不存在，添加target-->key对应关系
  if(!depsMap){
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  // 如果不存在，添加key-->dep对应关系
  if(!dep){
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
}

export function trackEffects(dep) {
    // 看看之前 dep 有没有添加过，添加过的话，那么就不添加了
    if(dep.has(activeEffect)) return
  
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
  
}

export function triggerEffects(dep) {
  for(const effect of dep){
    if(effect.scheduler){
      effect.scheduler()
    }else{
      effect.run()
    }
  }
}


export function effect(fn, options: any = {}) {
  // fn
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler)

  extend(_effect, options)

  _effect.run()
  // ---> runner
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}