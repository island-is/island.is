import { apiDomainsFinance } from './api-domains-finance'

describe('apiDomainsFinance', () => {
  it('should work', () => {
    expect(apiDomainsFinance()).toEqual('api-domains-finance')
  })
})
