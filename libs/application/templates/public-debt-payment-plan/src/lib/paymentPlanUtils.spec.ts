import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { prerequisitesFailed } from './paymentPlanUtils'

const buildApplication = (data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application => {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '1234567890',
    typeId: ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN,
    created: new Date(),
    modified: new Date(),
    applicantActors: [],
    attachments: {},
    answers,
    state,
    externalData,
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('prerequisitesFailed', () => {
  it('should return true because prerequisites doesnt exist in external data.', () => {
    const application = buildApplication()
    const res = prerequisitesFailed(application.externalData)

    expect(res).toBe(true)
  })
  it('should return a true value since the maxDebt prerequisite was true and caused the function to fail.', () => {
    const application = buildApplication({
      externalData: {
        paymentPlanPrerequisites: {
          data: {
            conditions: {
              maxDebt: true,
              taxReturns: false,
              vatReturns: false,
              citReturns: false,
              withholdingTaxReturns: false,
              wageReturns: false,
              collectionActions: true,
              doNotOwe: false,
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    const res = prerequisitesFailed(application.externalData)

    expect(res).toBe(true)
  })

  it('should return false since all prerequisites have their correct boolean assigned to them and therefore did not fail.', () => {
    const application = buildApplication({
      externalData: {
        paymentPlanPrerequisites: {
          data: {
            conditions: {
              maxDebt: false,
              taxReturns: true,
              vatReturns: true,
              citReturns: true,
              accommodationTaxReturns: true,
              withholdingTaxReturns: true,
              wageReturns: true,
              collectionActions: false,
              doNotOwe: true,
            },
          },
          date: new Date(),
          status: 'success',
        },
      },
    })
    const res = prerequisitesFailed(application.externalData)

    expect(res).toBe(false)
  })
})
