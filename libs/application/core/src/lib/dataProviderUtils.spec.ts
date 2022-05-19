import {
  callDataProviders,
  getErrorReasonIfPresent,
  isProviderErrorReason,
  isTranslationObject,
} from './dataProviderUtils'
import { BasicDataProvider } from '../types/BasicDataProvider'
import { ApplicationTypes } from '../types/ApplicationTypes'
import { Application, ApplicationStatus } from '../types/Application'
import { coreErrorMessages } from './messages'
import { StaticText } from '../types/Form'
import { isString, isObject } from 'lodash'

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

  it('Should not fail when providing custom error message with various test inputs for the error reason', async () => {
    expect(isTranslationObject('test')).toBe(false)
    const mockErrorReason = {
      title: 'title',
      summary: 'summary',
    }
    expect(isProviderErrorReason(mockErrorReason)).toBe(true)

    expect(getErrorReasonIfPresent(mockErrorReason)).toEqual({
      title: 'title',
      summary: 'summary',
    })

    const mockErrorReasonWithTranslationString = {
      title: coreErrorMessages.fileRemove,
      summary: coreErrorMessages.fileUpload,
    }

    expect(
      getErrorReasonIfPresent(mockErrorReasonWithTranslationString),
    ).toEqual({
      title: coreErrorMessages.fileRemove,
      summary: coreErrorMessages.fileUpload,
    })

    const mockErrorReasonStringOnly = 'someError'

    expect(isProviderErrorReason(mockErrorReasonStringOnly)).toBe(false)

    expect(getErrorReasonIfPresent(mockErrorReasonStringOnly)).toEqual({
      title: coreErrorMessages.errorDataProvider,
      summary: 'someError',
    })

    const mockErrorReasonTranslationOnly = coreErrorMessages.fileUpload

    expect(isProviderErrorReason(mockErrorReasonTranslationOnly)).toBe(false)

    expect(getErrorReasonIfPresent(mockErrorReasonTranslationOnly)).toEqual({
      title: coreErrorMessages.errorDataProvider,
      summary: coreErrorMessages.fileUpload,
    })

    expect(getErrorReasonIfPresent(undefined)).toEqual({
      title: coreErrorMessages.errorDataProvider,
      summary: coreErrorMessages.failedDataProvider,
    })
  })
})
