import { service } from './dsl'

describe('Configcat', () => {
  it('contains secret for configcat', () => {
    const sut = service('service-portal-api')
    expect(sut.serviceDef.secrets).toEqual({
      CONFIGCAT_SDK_KEY: '/k8s/configcat/CONFIGCAT_SDK_KEY',
    })
  })
})
