import { Test } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { FlightService, ADS_POSTAL_CODES } from '../../flight.service'
import { Flight, FlightLeg } from '../../flight.model'

describe('PublicFlightController', () => {
  let flightService: FlightService
  let flightModel: Flight

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FlightService,
        {
          provide: getModelToken(Flight),
          useClass: jest.fn(() => ({
            count: () => ({}),
          })),
        },
        {
          provide: getModelToken(FlightLeg),
          useClass: jest.fn(() => ({})),
        },
      ],
    }).compile()

    flightService = moduleRef.get<FlightService>(FlightService)
    flightModel = moduleRef.get<Flight>(getModelToken(Flight))
  })

  describe('isADSPostalCode', () => {
    const postalCodeBetween = (code1: number, code2: number): number =>
      Math.floor(Math.min(code1, code2) + Math.abs(code1 - code2) / 2)

    it('should not allow Reykjavík', async () => {
      const postalCode = 101
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(false)
    })

    it('should not allow anything below Reykhólahreppur', async () => {
      const postalCode = ADS_POSTAL_CODES['Reykhólahreppur'] - 1
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(false)
    })

    it('should allow Reykhólahreppur', async () => {
      const postalCode = ADS_POSTAL_CODES['Reykhólahreppur']
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })

    it('should allow postalcodes between Reykhólahreppur and Þingeyri', async () => {
      const postalCode = postalCodeBetween(
        ADS_POSTAL_CODES['Reykhólahreppur'],
        ADS_POSTAL_CODES['Þingeyri'],
      )
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })

    it('should allow Þingeyri', async () => {
      const postalCode = ADS_POSTAL_CODES['Þingeyri']
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })

    it('should not allow right above Þingeyri', async () => {
      const postalCode = ADS_POSTAL_CODES['Þingeyri'] + 1
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(false)
    })

    it('should not allow right below Hólmavík', async () => {
      const postalCode = ADS_POSTAL_CODES['Hólmavík'] - 1
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(false)
    })

    it('should allow Hólmavík', async () => {
      const postalCode = ADS_POSTAL_CODES['Hólmavík']
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })

    it('should allow postalcodes between Hólmavík and Öræfi', async () => {
      const postalCode = postalCodeBetween(
        ADS_POSTAL_CODES['Hólmavík'],
        ADS_POSTAL_CODES['Öræfi'],
      )
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })

    it('should allow Öræfi', async () => {
      const postalCode = ADS_POSTAL_CODES['Öræfi']
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })

    it('should not allow right above Öræfi', async () => {
      const postalCode = ADS_POSTAL_CODES['Öræfi'] + 1
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(false)
    })

    it('should allow Vestmannaeyjar', async () => {
      const postalCode = ADS_POSTAL_CODES['Vestmannaeyjar']
      const result = flightService.isADSPostalCode(postalCode)
      expect(result).toBe(true)
    })
  })

  describe('countThisYearsFlightLegsByNationalId', () => {
    const nationalId = '1234567890'

    it('should return 2 unused flights for 2020', async () => {
      Date.now = () => 1577836800000 // 2020
      jest
        .spyOn(flightModel as any, 'count')
        .mockImplementation(() => Promise.resolve(0))

      const result = await flightService.countThisYearsFlightLegsByNationalId(
        nationalId,
      )

      expect(result).toEqual({
        used: 0,
        unused: 2,
        total: 2,
      })
    })

    it('should return 6 unused flights for other years', async () => {
      Date.now = () => 1640995200000 // 2022
      jest
        .spyOn(flightModel as any, 'count')
        .mockImplementation(() => Promise.resolve(0))

      const result = await flightService.countThisYearsFlightLegsByNationalId(
        nationalId,
      )

      expect(result).toEqual({
        used: 0,
        unused: 6,
        total: 6,
      })
    })

    it('should return correct usage based on booked flights', async () => {
      Date.now = () => 1640995200000 // 2022
      jest
        .spyOn(flightModel as any, 'count')
        .mockImplementation(() => Promise.resolve(4))

      const result = await flightService.countThisYearsFlightLegsByNationalId(
        nationalId,
      )

      expect(result).toEqual({
        used: 4,
        unused: 2,
        total: 6,
      })
    })
  })

  describe('hasConnectingFlightPotentialFromFlightLegs', () => {
    const rvkAk10 = {
      date: new Date(Date.parse('2020-02-02T10:00')),
      origin: 'RVK',
      destination: 'AK',
    }

    const rvkAk22 = {
      date: new Date(Date.parse('2020-02-02T22:00')),
      origin: 'RVK',
      destination: 'AK',
    }

    const akRvk12 = {
      date: new Date(Date.parse('2020-02-02T12:00')),
      origin: 'AK',
      destination: 'RVK',
    }

    const akRvk16 = {
      date: new Date(Date.parse('2020-02-02T16:00')),
      origin: 'AK',
      destination: 'RVK',
    }

    const akRvk22 = {
      date: new Date(Date.parse('2020-02-02T22:00')),
      origin: 'AK',
      destination: 'RVK',
    }

    const akRvk23 = {
      date: new Date(Date.parse('2020-02-02T23:00')),
      origin: 'AK',
      destination: 'RVK',
    }

    const akGrims10 = {
      date: new Date(Date.parse('2020-02-02T10:00')),
      origin: 'AK',
      destination: 'GRIMS',
    }

    const akGrims12 = {
      date: new Date(Date.parse('2020-02-02T12:00')),
      origin: 'AK',
      destination: 'GRIMS',
    }

    const akGrims22 = {
      date: new Date(Date.parse('2020-02-02T22:00')),
      origin: 'AK',
      destination: 'GRIMS',
    }

    const akGrims23 = {
      date: new Date(Date.parse('2020-02-02T23:00')),
      origin: 'AK',
      destination: 'GRIMS',
    }

    const grimsAk10 = {
      date: new Date(Date.parse('2020-02-02T10:00')),
      origin: 'GRIMS',
      destination: 'AK',
    }

    const grimsAk23 = {
      date: new Date(Date.parse('2020-02-02T23:00')),
      origin: 'GRIMS',
      destination: 'AK',
    }

    const akVopn20 = {
      date: new Date(Date.parse('2020-02-02T20:00')),
      origin: 'AK',
      destination: 'VOPN',
    }

    it('from Reykjavik: connecting flight not allowed before', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        rvkAk22 as FlightLeg,
        akGrims12 as FlightLeg,
      )
      expect(result).toBe(false)

      // Flipping parameter order should not matter
      const result2 = flightService.hasConnectingFlightPotentialFromFlightLegs(
        akGrims12 as FlightLeg,
        rvkAk22 as FlightLeg,
      )
      expect(result2).toBe(false)
    })

    it('from Reykjavik: connecting flight not allowed more than 12 hours away', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        rvkAk10 as FlightLeg,
        akGrims23 as FlightLeg,
      )
      expect(result).toBe(false)

      // Flipping parameter order should not matter
      const result2 = flightService.hasConnectingFlightPotentialFromFlightLegs(
        akGrims23 as FlightLeg,
        rvkAk10 as FlightLeg,
      )
      expect(result2).toBe(false)
    })

    it('from Reykjavik: allowed if connecting flight is within 12 hours, inclusive', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        akGrims12 as FlightLeg,
        rvkAk10 as FlightLeg,
      )
      expect(result).toBe(true)

      const result2 = flightService.hasConnectingFlightPotentialFromFlightLegs(
        rvkAk10 as FlightLeg,
        akGrims22 as FlightLeg,
      )
      expect(result2).toBe(true)

      const result3 = flightService.hasConnectingFlightPotentialFromFlightLegs(
        rvkAk10 as FlightLeg,
        akGrims10 as FlightLeg,
      )
      expect(result3).toBe(true)
    })

    it('to Reykjavik: not allowed if connecting flight is after', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        grimsAk23 as FlightLeg,
        akRvk12 as FlightLeg,
      )
      expect(result).toBe(false)
    })

    it('to Reykjavik: not allowed if connecting flight more than 12 hours before', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        akRvk23 as FlightLeg,
        grimsAk10 as FlightLeg,
      )
      expect(result).toBe(false)
    })

    it('to Reykjavik: allowed if connecting flight is within 12 hours, inclusive, before', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        akRvk23 as FlightLeg,
        grimsAk23 as FlightLeg,
      )
      expect(result).toBe(true)

      const result2 = flightService.hasConnectingFlightPotentialFromFlightLegs(
        grimsAk10 as FlightLeg,
        akRvk16 as FlightLeg,
      )
      expect(result2).toBe(true)

      const result3 = flightService.hasConnectingFlightPotentialFromFlightLegs(
        grimsAk10 as FlightLeg,
        akRvk22 as FlightLeg,
      )
      expect(result3).toBe(true)
    })

    it('should have Reykjavik as a destination or origin in either flight', async () => {
      const result = flightService.hasConnectingFlightPotentialFromFlightLegs(
        grimsAk10 as FlightLeg,
        akVopn20 as FlightLeg,
      )
      expect(result).toBe(false)
    })
  })
})
