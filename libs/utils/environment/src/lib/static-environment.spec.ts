import { getStaticEnv, ENV_PREFIX } from './environment'

const setPrefix = (key: string) => `${ENV_PREFIX}${key}`

describe('getStaticEnv', () => {
  it('should return undefined if variable does not exist', () => {
    window.ENV = undefined

    const value = getStaticEnv(setPrefix('KEY'))

    expect(value).toBe(undefined)
  })

  it('should throw error if variable does not have correct env prefix', () => {
    window.ENV = { KEY: 'VALUE' }

    expect(() => getStaticEnv('KEY')).toThrow()
  })

  it('should get value', () => {
    window.ENV = { [setPrefix('KEY')]: 'VALUE' }

    const value = getStaticEnv(setPrefix('KEY'))

    expect(value).toBe('VALUE')
  })
})
