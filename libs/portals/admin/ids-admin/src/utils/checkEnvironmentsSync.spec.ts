import { checkEnvironmentsSync } from './checkEnvironmentsSync'

interface TestEnvironment {
  environment: string
  name: string
  boolField: boolean
  stringField: string
  arrayField: string[]
}

const makeEnv = (
  overrides: Partial<TestEnvironment> & { environment: string },
): TestEnvironment => ({
  name: 'test',
  boolField: true,
  stringField: 'value',
  arrayField: ['a', 'b', 'c'],
  ...overrides,
})

describe('checkEnvironmentsSync', () => {
  it('should return true when all environments match', () => {
    const envs = [
      makeEnv({ environment: 'Development' }),
      makeEnv({ environment: 'Staging' }),
      makeEnv({ environment: 'Production' }),
    ]

    expect(checkEnvironmentsSync(envs, ['boolField', 'stringField'])).toBe(true)
  })

  it('should return false when a scalar field differs', () => {
    const envs = [
      makeEnv({ environment: 'Development', boolField: true }),
      makeEnv({ environment: 'Staging', boolField: false }),
    ]

    expect(checkEnvironmentsSync(envs, ['boolField'])).toBe(false)
  })

  it('should return true when arrays have the same values in different order', () => {
    const envs = [
      makeEnv({
        environment: 'Development',
        arrayField: ['Custom', 'GeneralMandate', 'ProcurationHolder'],
      }),
      makeEnv({
        environment: 'Staging',
        arrayField: ['Custom', 'ProcurationHolder', 'GeneralMandate'],
      }),
      makeEnv({
        environment: 'Production',
        arrayField: ['Custom', 'GeneralMandate', 'ProcurationHolder'],
      }),
    ]

    expect(checkEnvironmentsSync(envs, ['arrayField'])).toBe(true)
  })

  it('should return false when arrays have different values', () => {
    const envs = [
      makeEnv({
        environment: 'Development',
        arrayField: ['Custom', 'GeneralMandate'],
      }),
      makeEnv({
        environment: 'Staging',
        arrayField: ['Custom', 'ProcurationHolder'],
      }),
    ]

    expect(checkEnvironmentsSync(envs, ['arrayField'])).toBe(false)
  })

  it('should only check specified variables', () => {
    const envs = [
      makeEnv({ environment: 'Development', boolField: true }),
      makeEnv({ environment: 'Staging', boolField: false }),
    ]

    expect(checkEnvironmentsSync(envs, ['stringField'])).toBe(true)
  })
})
