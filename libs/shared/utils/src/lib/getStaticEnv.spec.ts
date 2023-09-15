import { getStaticEnv, ENV_PREFIX } from './getStaticEnv'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      document: any
    }
  }
}

const setPrefix = (key: string) => `${ENV_PREFIX}${key}`

const mockGetElementById = (scriptContent: string) => {
  const script = document.createElement('script')
  script.setAttribute('id', '__SI_ENVIRONMENT__')
  script.textContent = scriptContent
  global.document.getElementById = jest.fn(() => script)
}

describe('getStaticEnv', () => {
  it('should return undefined if script does not exist', () => {
    global.document.getElementById = jest.fn(() => null)

    const value = getStaticEnv(setPrefix('KEY'))

    expect(value).toBe(undefined)
  })

  it('should return undefined if script is empty', () => {
    mockGetElementById('')

    const value = getStaticEnv(setPrefix('KEY'))

    expect(value).toBe(undefined)
  })

  it('should throw error if variable does not have correct env prefix', () => {
    mockGetElementById(JSON.stringify({ KEY: 'VALUE' }))

    expect(() => getStaticEnv('KEY')).toThrow()
  })

  it('should get value', () => {
    mockGetElementById(JSON.stringify({ [setPrefix('KEY')]: 'VALUE' }))

    const value = getStaticEnv(setPrefix('KEY'))

    expect(value).toBe('VALUE')
  })

  it('should get APP_VERSION value', () => {
    mockGetElementById(JSON.stringify({ APP_VERSION: 'VALUE' }))

    const value = getStaticEnv('APP_VERSION')

    expect(value).toBe('VALUE')
  })
})
