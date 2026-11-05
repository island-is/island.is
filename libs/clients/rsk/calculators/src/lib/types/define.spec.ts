import { enumOptions } from './define'

describe('enumOptions', () => {
  it('maps enum values to options in declaration order', () => {
    const Example = { B_KEY: 'b value', A_KEY: 'a value' } as const
    expect(enumOptions(Example)).toEqual([
      { value: 'b value' },
      { value: 'a value' },
    ])
  })
})
