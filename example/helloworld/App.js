import {
  h
} from '../../lib/guide-my-vue.esm.js'

export const App = {
  // .vue
  // <template></template>被编译为render函数
  // render
  render() {
    return h(
      "div", {
        id: "root",
        class: ["red", "hard"]
      },
      // "hi, my-vue"
      // Array
      [h("p", {class: "red"}, "hi"), h("p", {class: "green"}, "ha")]
    )
  },

  setup() {
    // composition api
    return {
      mag: "my-vue"
    }
  }
}