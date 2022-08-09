import { apiDomainsElectronicRegistrations } from './api-domains-electronic-registrations'

describe('apiDomainsElectronicRegistrations', () => {
  it('should work', () => {
    expect(apiDomainsElectronicRegistrations()).toEqual(
      'api-domains-electronic-registrations',
    )
  })
})
