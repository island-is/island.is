import { createApplication } from '@island.is/application/testing'
import { ApplicationTypes } from '@island.is/application/types'
import { createCurrentUser } from '@island.is/testing/fixtures'
import type { DistrictCommissionersHomeLodgingsService } from '@island.is/clients/district-commissioners-home-lodgings'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import type { TemplateApiModuleActionProps } from '../../../../types'
import { OvernightStaysRegistrationService } from './overnight-stays-registration.service'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

const mockHomeLodgingsService = {
  getHomeLodgings: jest.fn(),
  submitOvernightStays: jest.fn(),
}

const homeLodging = {
  id: 'HG00016707',
  address: 'Gervistaðir',
  postalCode: '101 Reykjavík',
  years: [
    { year: 2024, returned: false },
    { year: 2023, returned: true },
  ],
}

const auth = createCurrentUser({
  nationalId: '0101302399',
  scope: ['@island.is/applications:write'],
})

const createActionProps = (year = '2024'): TemplateApiModuleActionProps => ({
  application: createApplication({
    typeId: ApplicationTypes.OVERNIGHT_STAYS_REGISTRATION,
    answers: {
      homeLodgingId: 'HG00016707',
      year,
      advertisements: [{ url: 'https://booking.com/gervistadir' }],
      visits: [{ from: '2024-07-30', to: '2024-08-01' }],
      pricing: {
        method: 'monthly',
        monthlyAmounts: { month6: '20000' },
      },
      comments: 'Athugasemd',
    },
  }),
  auth,
  currentUserLocale: 'is',
})

const expectTemplateApiError = async (
  promise: Promise<unknown>,
  status: number,
  summary?: string,
) => {
  const error = await promise.catch((e: unknown) => e)
  expect(error).toBeInstanceOf(TemplateApiError)
  expect(error).toMatchObject({ problem: { status } })
  if (summary) {
    expect(error).toMatchObject({
      problem: {
        errorReason: { title: 'Ekki tókst að skila yfirliti', summary },
      },
    })
  }
}

describe('OvernightStaysRegistrationService', () => {
  let service: OvernightStaysRegistrationService

  beforeEach(() => {
    jest.clearAllMocks()
    mockHomeLodgingsService.getHomeLodgings.mockResolvedValue([homeLodging])
    service = new OvernightStaysRegistrationService(
      (mockLogger as unknown) as Logger,
      (mockHomeLodgingsService as unknown) as DistrictCommissionersHomeLodgingsService,
    )
  })

  describe('getHomeLodgings', () => {
    it('returns the home lodgings on record', async () => {
      await expect(
        service.getHomeLodgings({ auth } as TemplateApiModuleActionProps),
      ).resolves.toEqual([homeLodging])
    })

    it('throws when there are no home lodgings on record', async () => {
      mockHomeLodgingsService.getHomeLodgings.mockResolvedValue([])

      await expect(
        service.getHomeLodgings({ auth } as TemplateApiModuleActionProps),
      ).rejects.toBeInstanceOf(TemplateApiError)
    })
  })

  describe('submitApplication', () => {
    it('submits the payload to Sýslumenn and returns their receipt', async () => {
      mockHomeLodgingsService.submitOvernightStays.mockResolvedValue({
        id: 'receipt-1',
        submittedAt: '2026-11-26T10:00:00.000Z',
      })

      await expect(
        service.submitApplication(createActionProps()),
      ).resolves.toEqual({
        id: 'receipt-1',
        submittedAt: '2026-11-26T10:00:00.000Z',
        errors: [],
      })

      expect(mockHomeLodgingsService.submitOvernightStays).toHaveBeenCalledWith(
        auth,
        expect.objectContaining({
          homeLodgingId: 'HG00016707',
          year: 2024,
          advertisementUrls: ['https://booking.com/gervistadir'],
          hasActiveAdvertisement: true,
          comments: 'Athugasemd',
          nights: [
            {
              month: 7,
              dateRanges: [{ from: '2024-07-30', to: '2024-08-01' }],
              numberOfNights: 2,
              rentalIncome: 20000,
            },
          ],
        }),
      )
    })

    it('does not submit a year that has already been returned', async () => {
      await expectTemplateApiError(
        service.submitApplication(createActionProps('2023')),
        400,
      )
      expect(
        mockHomeLodgingsService.submitOvernightStays,
      ).not.toHaveBeenCalled()
    })

    it('surfaces the error returned by Sýslumenn', async () => {
      mockHomeLodgingsService.submitOvernightStays.mockResolvedValue({
        error: 'Ári hefur þegar verið skilað',
      })

      await expectTemplateApiError(
        service.submitApplication(createActionProps()),
        400,
        'Ári hefur þegar verið skilað',
      )
    })

    it('fails when Sýslumenn return no receipt id', async () => {
      mockHomeLodgingsService.submitOvernightStays.mockResolvedValue({})

      await expectTemplateApiError(
        service.submitApplication(createActionProps()),
        400,
      )
    })

    it('fails with a generic error when the request fails', async () => {
      mockHomeLodgingsService.submitOvernightStays.mockRejectedValue(
        new Error('Bad gateway'),
      )

      await expectTemplateApiError(
        service.submitApplication(createActionProps()),
        500,
      )
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
