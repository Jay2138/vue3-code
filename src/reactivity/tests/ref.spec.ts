import { effect } from "../effect";
import { reactive } from "../reactive";
import {ref, isRef, unRef, proxyRefs} from '../ref'

describe('ref', () => {
  it("happy path", () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(()=>{
      calls++
      dummy = a.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  });

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    })
    let dummy
    effect(()=>{
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  });

  it('isRef', () => {
    const a = ref(1)
    const user = reactive({foo:1})
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user)).toBe(false)
  });
  it('unRef', () => {
    const a = ref(1)
    const user = reactive({foo:1})
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  });

  it('proxyRefs', () => {
    // template 中直接使用ref，不用ref.value 
    // setup() {return { ref }}
    const user = {
      age: ref(10),
      name: "Lisa"
    }
    // get --> age (ref)  那么就返回.value
    // not ref --->直接返回 value

    //get
    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe("Lisa")

    // set
    proxyUser.age = 20
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)
  });
});