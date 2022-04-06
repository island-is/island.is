import { apiDomainsVehicles } from './api-domains-vehicles'

describe('apiDomainsVehicles', () => {
  it('should work', () => {
    expect(apiDomainsVehicles()).toEqual('api-domains-vehicles')
  })
})
