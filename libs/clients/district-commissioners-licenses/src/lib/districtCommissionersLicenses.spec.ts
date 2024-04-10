import { Test } from '@nestjs/testing'
import { DistrictCommissionersLicensesService } from './districtCommissionersLicenses.service'
import { RettindiFyrirIslandIsApi } from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

describe('DistrictCommissionersLicensesService', () => {
  let service: DistrictCommissionersLicensesService
  let apiMock: jest.Mocked<RettindiFyrirIslandIsApi>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DistrictCommissionersLicensesService,
        {
          provide: RettindiFyrirIslandIsApi,
          useValue: {
            withMiddleware: jest.fn().mockReturnThis(),
            rettindiFyrirIslandIsGet: jest.fn(),
            rettindiFyrirIslandIsGetStakt: jest.fn(),
          },
        },
        {
          provide: LOGGER_PROVIDER,
          useValue: {
            warn: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(DistrictCommissionersLicensesService)
    apiMock = module.get(RettindiFyrirIslandIsApi)
  })

  describe('getLicenses', () => {
    it('should return transformed licenses on successful API call', async () => {
      const user: User = { nationalId: '0101303019' } as User
      const mockResponse = {
        leyfi: [
          {
            audkenni: '20231847',
            titill: 'Verðbréfaréttindi',
            utgafudagur: new Date('2023-03-29T22:54:26'),
            utgefandi: {
              audkenni: '41',
              titill: 'Sýslumaðurinn á höfuðborgarsvæðinu',
            },
            stada: {
              titill: 'Í gildi',
              kodi: 'VALID',
            },
          },
          {
            audkenni: '202000001247',
            titill: 'Heimagisting - Test',
            utgafudagur: new Date('2020-01-22T11:11:33'),
            utgefandi: {
              audkenni: '41',
              titill: 'Sýslumaðurinn á höfuðborgarsvæðinu',
            },
            stada: {
              titill: 'Útrunnið',
              kodi: 'EXPIRED',
            },
          },
        ],
      }
      apiMock.rettindiFyrirIslandIsGet.mockResolvedValue(mockResponse)

      const result = await service.getLicenses(user)

      expect(result).toEqual([
        {
          id: '20231847',
          title: 'Verðbréfaréttindi',
          validFrom: '2023-03-29T22:54:26',
          issuerId: 'syslumadurinn-a-hoefudborgarsvaedinu',
          issuerTitle: 'Sýslumaðurinn á höfuðborgarsvæðinu',
          stada: 'valid',
        },
        {
          id: '202000001247',
          title: 'Heimagisting - Test',
          validFrom: '2020-01-22T11:11:33',
          issuerId: 'syslumadurinn-a-hoefudborgarsvaedinu',
          issuerTitle: 'Sýslumaðurinn á höfuðborgarsvæðinu',
          stada: 'expired',
        },
      ])
      expect(apiMock.rettindiFyrirIslandIsGet).toHaveBeenCalledWith({
        kennitala: '0101303019',
      })
    })

    it('should return null if no licenses are returned', async () => {
      const user: User = { nationalId: '0101303019' } as User
      const mockResponse = {}
      apiMock.rettindiFyrirIslandIsGet.mockResolvedValue(mockResponse)

      const result = await service.getLicenses(user)

      expect(result).toBe([])
      expect(apiMock.rettindiFyrirIslandIsGet).toHaveBeenCalledWith({
        kennitala: '0101303019',
      })
    })
  })

  describe('getLicense', () => {
    it('should return a single transformed license on successful API call', async () => {
      const user: User = { nationalId: '0101303019' } as User
      const mockResponse = {
        nafn: 'Gervimaður Afríka',
        leyfi: {
          audkenni: '20231847',
          titill: 'Verðbréfaréttindi',
          utgafudagur: new Date('2023-03-29T22:54:26'),
          utgefandi: {
            audkenni: 'syslumenn',
            titill: 'Sýslumaðurinn á höfuðborgarsvæðinu',
          },
          stada: {
            titill: 'Í vinnslu',
            kodi: 'INPROGRESS',
          },
        },
        svid: [
          {
            heiti: 'Gildir til',
            gildi: '1.1.2025',
            tegund: 'date',
          },
        ],
        textar: {
          haus: 'Verðbréfaréttindi eru gefin út skv. reglugerð X/Y.',
          fotur:
            'Nánari upplýsingar um verðbréfaréttindi eru veittar í verðbréfaréttindi@example.org',
        },
        adgerdir: [
          {
            tegund: 'file',
            titill: 'Sækja verðbréfaréttindi',
            slod: 'file://efb098e4-dd04-45cd-8bbd-9548df7b2c74',
          },
          {
            tegund: 'link',
            titill: 'Endurnýja verðbréfaréttindi',
            slod: 'https://example.org',
          },
        ],
        skrar: [
          {
            audkenni: 'efb098e4-dd04-45cd-8bbd-9548df7b2c74',
            tegund: 'application/pdf',
            skraarnafn: 'verðbréfaréttindi.pdf',
          },
        ],
      }

      apiMock.rettindiFyrirIslandIsGetStakt.mockResolvedValue(mockResponse)

      const result = await service.getLicense(user, '123')

      expect(result).toEqual({
        id: '123',
        // Add other transformed properties
      })
      expect(apiMock.rettindiFyrirIslandIsGetStakt).toHaveBeenCalledWith({
        audkenni: '123',
      })
    })

    // Add more tests for error handling, logging, and edge cases
  })
})
