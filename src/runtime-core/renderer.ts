import { isObject } from '../shared/index';
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // patch--->后续递归调用patch
  patch(vnode, container)
}

function patch(vnode, container) {
  // 去处理组件

  // TODO:判断vnode是不是一个element，
  // 是 element 就应该处理 element
  // 思考如何区分是 element类型，还是 component 类型？  
  // processElement(vnode)
  console.log(vnode.type);
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  }else if(isObject(vnode.type)){
    processComponent(vnode, container)
  }
}

function processElement(vnode, container){
  // initmount-->初始化挂载     update-->更新
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { type, children, props } = vnode
  const el = document.createElement(type) // 对应vnode的type
  // string, array
  if(typeof children === "string"){
    el.textContent = children// 对应vnode的children
  }else{
    children.forEach((item)=>{
      patch(item, el)
    })
  }
  // props
  // el.setAttribute("id", "root") // 对应vnode的props
  for(const key in props){
    const val = props[key]
    el.setAttribute(key, val)
  }
  container.append(el)
}

function processComponent(vnode, container) {
  // initmount-->初始化挂载     update-->更新
  mountCompinent(vnode, container)
}

function mountCompinent(vnode, container) {
  const instance = createComponentInstance(vnode) // 用虚拟节点创建组件实例对象，后期处理proxy，slot等
  setupComponent(instance) // 处理proxy，处理插槽，以及处理当前组件调用setup返回出来的值
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()

  // subTree-->就是虚拟节点树，基于返回回来的这个虚拟节点，再去调用patch（），如果是组件的话继续去拆，如果是element类型，就实际渲染
  // vnode--->element--->mountElement

  patch(subTree, container)

}