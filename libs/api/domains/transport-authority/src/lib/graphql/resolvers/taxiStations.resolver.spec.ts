import { Test, TestingModule } from '@nestjs/testing'
import { TaxiClient } from '@island.is/clients/transport-authority/taxi'
import { TaxiStationsResolver } from './taxiStations.resolver'

const mockStation = {
  id: 1,
  name: 'Hreyfill',
  persidno: '5001012340',
  emailAddress: 'hreyfill@hreyfill.is',
  licenceNumber: 'L-001',
  validFrom: new Date('2023-01-01'),
  validTo: new Date('2025-01-01'),
  driverCount: 42,
}

describe('TaxiStationsResolver', () => {
  let resolver: TaxiStationsResolver
  let taxiClient: jest.Mocked<TaxiClient>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxiStationsResolver,
        {
          provide: TaxiClient,
          useValue: {
            getValidStations: jest.fn(),
          },
        },
      ],
    }).compile()

    resolver = module.get<TaxiStationsResolver>(TaxiStationsResolver)
    taxiClient = module.get(TaxiClient)
  })

  it('should be defined', () => {
    expect(resolver).toBeDefined()
  })

  it('returns stations from the client', async () => {
    taxiClient.getValidStations.mockResolvedValue([mockStation])

    const result = await resolver.getTaxiStations()

    expect(taxiClient.getValidStations).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ stations: [mockStation] })
  })

  it('returns empty array when client returns null', async () => {
    taxiClient.getValidStations.mockResolvedValue(null as any)

    const result = await resolver.getTaxiStations()

    expect(result).toEqual({ stations: [] })
  })

  it('returns empty array when client returns empty list', async () => {
    taxiClient.getValidStations.mockResolvedValue([])

    const result = await resolver.getTaxiStations()

    expect(result).toEqual({ stations: [] })
  })
})
