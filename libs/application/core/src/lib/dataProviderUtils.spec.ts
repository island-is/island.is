import { callDataProviders } from './dataProviderUtils'
import { BasicDataProvider } from '../types/BasicDataProvider'
import { ApplicationTypes } from '../types/ApplicationTypes'
import { Application, ApplicationStatus } from '../types/Application'

class ExampleProviderThatAlwaysFails extends BasicDataProvider {
  readonly type = 'ExampleFails'

  provide(): Promise<unknown> {
    return Promise.reject('this should reject')
  }
}

class ExampleProviderThatAlwaysSucceeds extends BasicDataProvider {
  readonly type = 'ExampleSucceeds'

  provide(): Promise<string> {
    return Promise.resolve('success')
  }
}

const application: Application = {
  id: '123',
  assignees: [],
  state: 'draft',
  applicant: '111111-3000',
  applicantActors: [],
  typeId: ApplicationTypes.EXAMPLE,
  modified: new Date(),
  created: new Date(),
  answers: {},
  externalData: {},
  status: ApplicationStatus.IN_PROGRESS,
}

const mockTemplateFindQuery = async () => []
const mockFormatMessage = () => 'message'

describe('dataProviderUtils', () => {
  it('should return results in place', async () => {
    const dataProviders = [
      new ExampleProviderThatAlwaysSucceeds(),
      new ExampleProviderThatAlwaysSucceeds(),
    ]
    const result = await callDataProviders(
      dataProviders,
      application,
      mockTemplateFindQuery,
      mockFormatMessage,
    )
    expect(result).toEqual([
      expect.objectContaining({
        data: true,
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
      new ExampleProviderThatAlwaysSucceeds(),
      new ExampleProviderThatAlwaysFails(),
      new ExampleProviderThatAlwaysSucceeds(),
    ]
    const result = await callDataProviders(
      dataProviders,
      application,
      mockTemplateFindQuery,
      mockFormatMessage,
    )
    expect(result).toEqual([
      expect.objectContaining({
        data: true,
        status: 'success',
      }),
      expect.objectContaining({
        status: 'failure',
      }),
      expect.objectContaining({
        data: true,
        status: 'success',
      }),
    ])
  })
})
