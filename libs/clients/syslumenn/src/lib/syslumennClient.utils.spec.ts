import { parseShare } from './syslumennClient.utils'

describe('syslumennClient.utils.parseShare', () => {
  it('Should handle commas', () => {
    expect(parseShare('1,5')).toStrictEqual(1.5)
    expect(parseShare('50,002')).toStrictEqual(50.002)
  })

  it('Should handle normal floating point numbers', () => {
    expect(parseShare('1.5')).toStrictEqual(1.5)
    expect(parseShare('50.002')).toStrictEqual(50.002)
  })

  it('Should handle integers', () => {
    expect(parseShare('1')).toStrictEqual(1)
    expect(parseShare('50')).toStrictEqual(50)
  })

  it('Should handle edge cases', () => {
    expect(parseShare('0')).toStrictEqual(0)
    expect(parseShare('0.0')).toStrictEqual(0)
    expect(parseShare('0,0')).toStrictEqual(0)

    expect(parseShare('100')).toStrictEqual(100)
    expect(parseShare('100.0')).toStrictEqual(100)
    expect(parseShare('100,0')).toStrictEqual(100)
  })
})
