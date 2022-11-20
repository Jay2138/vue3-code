import {isTracking, trackEffects, triggerEffects} from './effect'
import {hasChanged, isObject} from '../shared'
import { reactive } from './reactive'


/***
 * 1 true '1'--->单值
 * get set
 * proxy --> object
 * {} --> value get set
 */
class RefImpl{
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    // 1. 判断value是不是对象
    this._value = convert(value)
    this.dep = new Set()
  }
  get value() {
    if(isTracking()){
      trackEffects(this.dep)
    }
    return this._value
  }
  set value(newValue) {
    // 一定是先修改了 value 的
    // 对比的时候  object
    if(hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep) 
    }
  }
}


export function ref(value) {
  return new RefImpl(value)
}

function convert(value) {
  return isObject(value) ? reactive(value) : value 
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  // 判断是不是ref-->ref.value
  return isRef(ref) ? ref.value : ref 
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      // 属性是ref且新的值不是ref类型
      if(isRef(target[key]) && !isRef(value)){
        return target[key].value = value
      }else{
        return Reflect.set(target, key, value)
      }
    }
  })
} 