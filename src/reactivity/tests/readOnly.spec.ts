import {readOnly, isReadOnly, isProxy} from '../reactive'

describe("readOnly", () => {
  it('happy path', () => {
    // not set

    const original = {foo: 1, bar: {baz: 2}}
    const wrapped = readOnly(original)
    expect(wrapped).not.toBe(original)
    expect(isReadOnly(wrapped)).toBe(true)
    expect(isReadOnly(wrapped.bar)).toBe(true)
    expect(isReadOnly(original.bar)).toBe(false)
    expect(wrapped.foo).toBe(1)
    expect(isProxy(wrapped)).toBe(true)

  });
})