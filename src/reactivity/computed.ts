import {ReactiveEffect} from './effect'


class ComputeRefImpl{
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: any
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, ()=>{
      if(!this._dirty){
        this._dirty = true
      }
    })
  }

  get value() {
    // 第一次实例调用.value
    // 当依赖的响应式对象的值发生改变的时候
    // effect
    // this._dirty 标记当前变量有没有被调用过
    if(this._dirty){
      this._dirty = false
      this._value = this._effect.run() // 拿最新值
    }
    // 后续不用执行setter，直接返回暂存的值
    return this._value
  }

}


export function computed(getter) {
  return new ComputeRefImpl(getter)
}