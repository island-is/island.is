import { getOptions } from './sequelize'

describe('getOptions validate', () => {
  it('should not recycle on first run', () => {
    const options = getOptions()
    const params = {}

    const validate = options.pool?.validate

    expect(typeof validate).toBe('function')
    validate && expect(validate(params)).toBe(true)
  })

  it('should recycle not recycle when not expired', () => {
    const options = getOptions()
    const date = new Date()
    date.setDate(date.getDate() + 1) // 1 day into the future
    const params = { recycleWhen: date }

    const validate = options.pool?.validate

    expect(typeof validate).toBe('function')
    validate && expect(validate(params)).toBe(true)
  })

  it('should recycle when expired', () => {
    const options = getOptions()
    const params = { recycleWhen: new Date('2022-01-27T12:00:00.000Z') }

    const validate = options.pool?.validate

    expect(typeof validate).toBe('function')
    validate && expect(validate(params)).toBe(false)
  })
})
