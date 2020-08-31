import { callDataProviders } from './dataProviderUtils'
import { DataProvider, DataProviderTypes } from './DataProvider'
import { ExpectedDateOfBirth } from '../providers/ExpectedDateOfBirth'

class ExampleProviderThatAlwaysFails extends DataProvider {
  readonly type: DataProviderTypes.EXAMPLE_FAILS

  provide(): Promise<unknown> {
    return Promise.reject('this should reject')
  }
}

class ExampleProviderThatAlwaysSucceeds extends DataProvider {
  readonly type: DataProviderTypes.EXAMPLE_SUCCEEDS

  provide(): Promise<string> {
    return Promise.resolve('success')
  }
}

describe('dataProviderUtils', () => {
  it('should return results in place', async () => {
    const dataProviders = [
      new ExpectedDateOfBirth(),
      new ExampleProviderThatAlwaysSucceeds(),
    ]
    const result = await callDataProviders(dataProviders)
    expect(result).toEqual([
      expect.objectContaining({
        data: '2020-12-24',
        status: 'success',
      }),
      expect.objectContaining({
        data: true,
        status: 'success',
      }),
    ])
  })
  it('should not fail although only one data provider fails, but still return all data provider results, in place', async () => {
    const dataProviders = [
      new ExpectedDateOfBirth(),
      new ExampleProviderThatAlwaysFails(),
      new ExampleProviderThatAlwaysSucceeds(),
    ]
    const result = await callDataProviders(dataProviders)
    expect(result).toEqual([
      expect.objectContaining({
        data: '2020-12-24',
        status: 'success',
      }),
      expect.objectContaining({
        status: 'failure',
      }),
      expect.objectContaining({
        status: 'success',
      }),
    ])
  })
})
