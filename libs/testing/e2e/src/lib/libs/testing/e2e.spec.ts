import { libsTestingE2e } from './e2e'

describe('libsTestingE2e', () => {
  it('should work', () => {
    expect(libsTestingE2e()).toEqual('libs/testing/e2e')
  })
})
