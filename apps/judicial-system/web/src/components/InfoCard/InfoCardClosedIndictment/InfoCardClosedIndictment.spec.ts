import { IndictmentCaseReviewDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { formatMessage } from '@island.is/judicial-system-web/src/utils/testHelpers'

import { getAdditionalDataSections } from './InfoCardClosedIndictment'

describe('getAdditionalDataSections', () => {
  it('should return an empty array if neither reviewer name nor review decision is provided', () => {
    const dataSections = getAdditionalDataSections(formatMessage)

    expect(dataSections).toStrictEqual([])
  })

  it('should return an empty array if only the review decision is provided', () => {
    const reviewName = undefined
    const reviewDecision = IndictmentCaseReviewDecision.APPEAL

    const dataSections = getAdditionalDataSections(
      formatMessage,
      reviewName,
      reviewDecision,
    )

    expect(dataSections).toStrictEqual([])
  })

  it('should return an object with the reviewer name if the reviewer name is provided', () => {
    const reviewerName = 'John Doe'
    const dataSections = getAdditionalDataSections(formatMessage, reviewerName)

    expect(dataSections).toStrictEqual([
      { data: [{ title: 'Yfirlestur', value: 'John Doe' }] },
    ])
  })

  it('should return an object with the reviewer name and the review decision if both are provided', () => {
    const reviewerName = 'John Doe'
    const dataSections = getAdditionalDataSections(
      formatMessage,
      reviewerName,
      IndictmentCaseReviewDecision.ACCEPT,
    )

    expect(dataSections).toStrictEqual([
      {
        data: [
          { title: 'Yfirlestur', value: 'John Doe' },
          { title: 'Ákvörðun', value: 'Una' },
        ],
      },
    ])
  })
})
