import * as utils from './accident-notification.utils'
import { Application } from '@island.is/application/types'

const createMockPartialApplication = (documentId?: number): Application =>
  ({
    externalData: {
      submitApplication: {
        data: documentId
          ? { documentId, sentDocuments: ['hello', 'there'] }
          : undefined,
      },
    },
  } as unknown as Application)

describe('getApplicationDocumentId', () => {
  it('should return a valid application submission document id', () => {
    const expectedId = 5555
    const application = createMockPartialApplication(expectedId)

    const result = utils.getApplicationDocumentId(application)
    expect(result).toEqual(expectedId)
  })

  it('should throw when there is no valid application submission document id', () => {
    const application = createMockPartialApplication(undefined)

    expect(() => utils.getApplicationDocumentId(application)).toThrowError(
      'No documentId found on application',
    )
  })
})
