import { Test, TestingModule } from '@nestjs/testing'
import { TaxiClient } from '@island.is/clients/transport-authority/taxi'
import { TaxiDriversResolver } from './taxiDrivers.resolver'

const mockDriver = {
  id: 1,
  name: 'Jón Jónsson',
  persidno: '1234567890',
  address: 'Laugavegur 1, 101 Reykjavík',
  organisationName: 'Hreyfill ehf.',
  stationName: 'Hreyfill',
  validFrom: new Date('2023-01-01'),
  validTo: new Date('2025-01-01'),
  emailAddress: 'jon@hreyfill.is',
  organisationId: 10,
  stationId: 5,
  callNumber: '101',
  representativePersidno: null,
  representativeName: null,
}

describe('TaxiDriversResolver', () => {
  let resolver: TaxiDriversResolver
  let taxiClient: jest.Mocked<TaxiClient>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxiDriversResolver,
        {
          provide: TaxiClient,
          useValue: {
            getDriversWithWorkPermit: jest.fn(),
            getDriversWithOperatingLicence: jest.fn(),
          },
        },
      ],
    }).compile()

    resolver = module.get<TaxiDriversResolver>(TaxiDriversResolver)
    taxiClient = module.get(TaxiClient)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  describe('getTaxiDriversWithWorkPermit', () => {
    it('returns drivers from the client', async () => {
      taxiClient.getDriversWithWorkPermit.mockResolvedValue([mockDriver])

      const result = await resolver.getTaxiDriversWithWorkPermit()

      expect(taxiClient.getDriversWithWorkPermit).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ drivers: [mockDriver] })
    })

    it('returns empty array when client returns null', async () => {
      taxiClient.getDriversWithWorkPermit.mockResolvedValue(null as any)

      const result = await resolver.getTaxiDriversWithWorkPermit()

      expect(result).toEqual({ drivers: [] })
    })

    it('returns empty array when client returns empty list', async () => {
      taxiClient.getDriversWithWorkPermit.mockResolvedValue([])

      const result = await resolver.getTaxiDriversWithWorkPermit()

      expect(result).toEqual({ drivers: [] })
    })
  })

  describe('getTaxiDriversWithOperatingLicence', () => {
    it('returns drivers from the client', async () => {
      taxiClient.getDriversWithOperatingLicence.mockResolvedValue([mockDriver])

      const result = await resolver.getTaxiDriversWithOperatingLicence()

      expect(taxiClient.getDriversWithOperatingLicence).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ drivers: [mockDriver] })
    })

    it('returns empty array when client returns null', async () => {
      taxiClient.getDriversWithOperatingLicence.mockResolvedValue(null as any)

      const result = await resolver.getTaxiDriversWithOperatingLicence()

      expect(result).toEqual({ drivers: [] })
    })

    it('returns empty array when client returns empty list', async () => {
      taxiClient.getDriversWithOperatingLicence.mockResolvedValue([])

      const result = await resolver.getTaxiDriversWithOperatingLicence()

      expect(result).toEqual({ drivers: [] })
    })
  })
})
