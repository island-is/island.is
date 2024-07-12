import { playwrightTests } from './playwright-tests'

describe('playwrightTests', () => {
  it('should work', () => {
    expect(playwrightTests()).toEqual('playwright-tests')
  })
})
