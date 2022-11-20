/**
 * 
 * @param 创建组件实例对象
 * @returns object
 */

export function createComponentInstance(vnode){
  const component = {
    vnode,
    type: vnode.type
  } 

  return component
}

export function setupComponent(instance) {

  // TODO 待处理
  // initProps()
  // initSlots()
  // 有状态的组件
  setupStatefulComponent(instance) // 处理setup调用后的返回值

}


function setupStatefulComponent(instance: any){
  const component = instance.type  // type-对应->rootComponent创建的vnode

  const  { setup } = component
  if(setup) {
    // setup()可以返回一个function或者 Object
    // 如果返回是一个函数，就认为他是组件的一个render函数，如果是一个object，那么就把这个对象注入到组件的上下文中
    const setupResult = setup() // {mag: 'my-vue'}

    handleSetupResult(instance, setupResult)
  }
}
// 基于上面两种情况来做判断，先实现object， TODO：function
function handleSetupResult(instance, setupResult: any) {
  // 如果是对象，那么就把这个值赋值到实例上--instance
  if(typeof setupResult === 'object'){
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}
// 保证render有值
function finishComponentSetup(instance){
  const Component = instance.type
  // 假设用户一定会写render
  // if(Component.render){
    instance.render = Component.render
  // }
}