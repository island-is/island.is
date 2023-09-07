import { apiDomainsUniversityGateway } from './api-domains-university-gateway'

describe('apiDomainsUniversityGateway', () => {
  it('should work', () => {
    expect(apiDomainsUniversityGateway()).toEqual(
      'api-domains-university-gateway',
    )
  })
})
