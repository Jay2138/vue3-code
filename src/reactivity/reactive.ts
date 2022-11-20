import {track, trigger} from './effect'
import { isObject } from '../shared'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly"
}


function createGetter(isReadOnly = false, shallow = false) {
  return function get (target, key) {
    if(key === ReactiveFlags.IS_REACTIVE){
      return !isReadOnly
    }else if(key === ReactiveFlags.IS_READONLY){
      return isReadOnly
    }

    const res = Reflect.get(target, key)

    if(shallow) {
      return res
    }
    // 看看res是不是object， 
    if(isObject(res)){
      return isReadOnly ? readOnly(res) : reactive(res)
    }

    if(!isReadOnly){
      // TODO: 依赖收集
      track(target, key)
    }
    return res
  }
}

function createSetter(){
  return function set(target, key,  value) {
    const res = Reflect.set(target, key,  value)
    // TODO: 触发依赖
    trigger(target, key)
    return res
  }
}

export function reactive(raw) {
  return new Proxy(raw, {
    get: createGetter(),
    set: createSetter()
  })
}

export function readOnly(raw){
  return new Proxy(raw, {
    get: createGetter(true),
    set(target, key,  value) {
      console.warn(`key: ${String(key)}set 失败，因为target 是readOnly类型`, target)
      return true
    }
  })
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function shallowReadonly(raw) {
  return new Proxy(raw, {
    get: createGetter(true, true),
    set(target, key,  value) {
      console.warn(`key: ${String(key)}set 失败，因为target 是shallowReadonly类型`, target)
      return true
    }
  })
}

export function isProxy(value) {
  return isReactive(value) || isReadOnly(value)
}