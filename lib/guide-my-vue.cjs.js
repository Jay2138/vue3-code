'use strict';

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
}

const isObject = (val) => {
    return val !== null && typeof val === "object";
};

/**
 *
 * @param 创建组件实例对象
 * @returns object
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // TODO 待处理
    // initProps()
    // initSlots()
    // 有状态的组件
    setupStatefulComponent(instance); // 处理setup调用后的返回值
}
function setupStatefulComponent(instance) {
    const component = instance.type; // type-对应->rootComponent创建的vnode
    const { setup } = component;
    if (setup) {
        // setup()可以返回一个function或者 Object
        // 如果返回是一个函数，就认为他是组件的一个render函数，如果是一个object，那么就把这个对象注入到组件的上下文中
        const setupResult = setup(); // {mag: 'my-vue'}
        handleSetupResult(instance, setupResult);
    }
}
// 基于上面两种情况来做判断，先实现object， TODO：function
function handleSetupResult(instance, setupResult) {
    // 如果是对象，那么就把这个值赋值到实例上--instance
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
// 保证render有值
function finishComponentSetup(instance) {
    const Component = instance.type;
    // 假设用户一定会写render
    // if(Component.render){
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    // patch--->后续递归调用patch
    patch(vnode, container);
}
function patch(vnode, container) {
    // 去处理组件
    // TODO:判断vnode是不是一个element，
    // 是 element 就应该处理 element
    // 思考如何区分是 element类型，还是 component 类型？  
    // processElement(vnode)
    console.log(vnode.type);
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // initmount-->初始化挂载     update-->更新
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, children, props } = vnode;
    const el = document.createElement(type); // 对应vnode的type
    // string, array
    if (typeof children === "string") {
        el.textContent = children; // 对应vnode的children
    }
    else {
        children.forEach((item) => {
            patch(item, el);
        });
    }
    // props
    // el.setAttribute("id", "root") // 对应vnode的props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function processComponent(vnode, container) {
    // initmount-->初始化挂载     update-->更新
    mountCompinent(vnode, container);
}
function mountCompinent(vnode, container) {
    const instance = createComponentInstance(vnode); // 用虚拟节点创建组件实例对象，后期处理proxy，slot等
    setupComponent(instance); // 处理proxy，处理插槽，以及处理当前组件调用setup返回出来的值
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // subTree-->就是虚拟节点树，基于返回回来的这个虚拟节点，再去调用patch（），如果是组件的话继续去拆，如果是element类型，就实际渲染
    // vnode--->element--->mountElement
    patch(subTree, container);
}

function createApp(rootComponent) {
    return {
        // rootContainer-->根容器--element
        mount(rootContainer) {
            // 先 vnode--转为虚拟节点
            // component（根组件App.vue） --> vnode
            // 所有的逻辑操作都会基于 vnode 处理
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}
// 15.23

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
