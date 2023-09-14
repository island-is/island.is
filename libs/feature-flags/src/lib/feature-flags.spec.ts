import * as ConfigCatJs from 'configcat-js'
import * as ConfigCatNode from 'configcat-node'
import * as configcatBase from './configcat'
import { SDK_KEY_ERROR } from './constants'
import { createClientFactory } from './factory'

const createClientJS = createClientFactory(ConfigCatJs)
const createClientNode = createClientFactory(ConfigCatNode)

const clientTypes = [
  { create: createClientJS, name: 'JS' },
  { create: createClientNode, name: 'Node' },
]

describe('Singleton client', () => {
  clientTypes.forEach((clientType) => {
    describe(`${clientType.name} Client`, () => {
      it('should retrieve the client from cache and not create a new one', () => {
        const spy = jest.spyOn(configcatBase, 'createFeatureFlagClient')
        const a = clientType.create()
        const b = clientType.create()
        expect(spy).toHaveBeenCalledTimes(1)
        a.dispose()
        b.dispose()
      })
    })
  })
})

describe('Client sdk key', () => {
  const ORIGINAL_SDK_KEY = process.env.CONFIGCAT_SDK_KEY

  beforeAll(() => {
    delete process.env.CONFIGCAT_SDK_KEY
  })
  afterAll(() => {
    process.env.CONFIGCAT_SDK_KEY = ORIGINAL_SDK_KEY
  })

  clientTypes.forEach(({ name, create }) => {
    it(`should fail initializing ${name} Client if sdk key is missing`, () => {
      expect(() => create()).toThrow(SDK_KEY_ERROR)
    })
  })
  clientTypes.forEach(({ name, create }) => {
    it(`should initialize ${name} Client using sdkKey as prop`, () => {
      expect(() => create({ sdkKey: ORIGINAL_SDK_KEY })).not.toThrow()
    })
  })
})
