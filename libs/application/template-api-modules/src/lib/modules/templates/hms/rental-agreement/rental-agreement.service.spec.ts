import { ApplicationWithAttachments } from '@island.is/application/types'
import { HomeApi } from '@island.is/clients/hms-rental-agreement'
import { TemplateApiModuleActionProps } from '../../../../types'
import { TemplateApiError } from '@island.is/nest/problem'
import { RentalAgreementService } from './rental-agreement.service'

describe('RentalAgreementService.submitApplicationToHmsRentalService', () => {
  const contractPost = jest.fn()
  const homeApi = {
    withMiddleware: () => ({ contractPost }),
  } as unknown as HomeApi
  const service = new RentalAgreementService(homeApi)

  const submit = (answers: ApplicationWithAttachments['answers']) =>
    service.submitApplicationToHmsRentalService({
      application: { id: 'application-id', applicant: '0101302989', answers },
      auth: {},
    } as TemplateApiModuleActionProps)

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-10-06T13:00:00Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    contractPost.mockReset()
  })

  it.each([
    ['nested answer', { rentalPeriod: { startDate: '2026-11-07' } }],
    // A dotted key bypasses the data schema but is still read as the start date
    ['dotted answer key', { 'rentalPeriod.startDate': '2027-06-01' }],
  ])(
    'rejects a start date more than one month ahead (%s) without calling HMS',
    async (_, answers) => {
      await expect(submit(answers)).rejects.toBeInstanceOf(TemplateApiError)
      expect(contractPost).not.toHaveBeenCalled()
    },
  )
})
