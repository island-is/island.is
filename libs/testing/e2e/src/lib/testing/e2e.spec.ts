import { testingE2e } from './testing/e2e'

describe('testingE2e', () => {
  it('should work', () => {
    expect(testingE2e()).toEqual('testing/e2e')
  })
})
