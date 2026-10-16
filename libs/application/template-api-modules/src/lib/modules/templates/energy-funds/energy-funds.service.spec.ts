import { createApplication } from '@island.is/application/testing'
import { ApplicationTypes } from '@island.is/application/types'
import { createCurrentUser } from '@island.is/testing/fixtures'
import type { EnergyFundsClientService } from '@island.is/clients/energy-funds'
import type { VehicleSearchApi } from '@island.is/clients/vehicles'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import type { TemplateApiModuleActionProps } from '../../../types'
import { EnergyFundsService } from './energy-funds.service'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}

const mockVehiclesApi = {
  withMiddleware: jest.fn(),
  basicVehicleInformationGet: jest.fn(),
}

const mockEnergyFundsClientService = {
  submitEnergyFundsApplication: jest.fn(),
}

const createActionProps = (price: string): TemplateApiModuleActionProps => ({
  application: createApplication({
    typeId: ApplicationTypes.ENERGY_FUNDS,
    answers: {
      selectVehicle: {
        plate: 'AB123',
        grantAmount: 400000,
        grantItemCode: 'ITEM1',
      },
      vehicleDetails: { price },
    },
    externalData: {
      currentVehicles: {
        data: {
          totalRecords: 1,
          vehicles: [
            {
              permno: 'AB123',
              vin: 'VIN123',
              make: 'Test',
              vehicleRegistrationCode: 'M1',
              newRegistrationDate: '2026-10-01',
              firstRegistrationDate: '2026-10-01',
            },
          ],
        },
        date: new Date(),
        status: 'success',
      },
    },
  }),
  auth: createCurrentUser(),
  currentUserLocale: 'is',
})

describe('EnergyFundsService', () => {
  let service: EnergyFundsService

  beforeEach(() => {
    jest.clearAllMocks()
    mockVehiclesApi.withMiddleware.mockReturnValue(mockVehiclesApi)
    service = new EnergyFundsService(
      mockLogger as unknown as Logger,
      mockEnergyFundsClientService as unknown as EnergyFundsClientService,
      mockVehiclesApi as unknown as VehicleSearchApi,
    )
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('submitApplication price cap', () => {
    const submit = (euGroup: string, price: string) => {
      const props = createActionProps(price)
      mockVehiclesApi.basicVehicleInformationGet.mockResolvedValue({
        euGroup,
        owners: [{ persidno: props.auth.nationalId }],
      })
      return service.submitApplication(props)
    }

    it('rejects a passenger car over 8M from 1 November 2026 and names the cap', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-11-01T08:00:00Z'))

      const result = submit('M1', '9000000')

      await expect(result).rejects.toBeInstanceOf(TemplateApiError)
      await expect(result).rejects.toMatchObject({
        problem: {
          errorReason: { summary: { values: { priceCap: '8.000.000 kr.' } } },
        },
      })
      expect(
        mockEnergyFundsClientService.submitEnergyFundsApplication,
      ).not.toHaveBeenCalled()
    })

    it('sends a passenger car over 8M before 1 November 2026', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-10-31T23:00:00Z'))

      await submit('M1', '9000000')

      expect(
        mockEnergyFundsClientService.submitEnergyFundsApplication,
      ).toHaveBeenCalledTimes(1)
    })

    it('sends a van over 8M from 1 November 2026', async () => {
      jest.useFakeTimers().setSystemTime(new Date('2026-11-01T08:00:00Z'))

      await submit('N1', '9000000')

      expect(
        mockEnergyFundsClientService.submitEnergyFundsApplication,
      ).toHaveBeenCalledWith(expect.anything(), {
        subsidyInput: expect.objectContaining({ purchasePrice: 9000000 }),
      })
    })
  })
})
