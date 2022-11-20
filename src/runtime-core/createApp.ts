import {createVNode} from './vnode'
import { render } from './renderer'

export function createApp(rootComponent){ // 接受一个根组件
  return {
    // rootContainer-->根容器--element
    mount(rootContainer) {
      // 先 vnode--转为虚拟节点
      // component（根组件App.vue） --> vnode
      // 所有的逻辑操作都会基于 vnode 处理
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}

// 15.23