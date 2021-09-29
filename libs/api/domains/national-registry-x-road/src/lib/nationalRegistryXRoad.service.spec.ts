import { Test } from '@nestjs/testing'
import { NationalRegistryXRoadService } from './nationalRegistryXRoad.service'
import { LoggingModule } from '@island.is/logging'

describe('NationalRegistryXRoadService', () => {
  let service: NationalRegistryXRoadService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        NationalRegistryXRoadService,
        { provide: 'Config', useValue: {} },
      ],
    }).compile()

    service = module.get(NationalRegistryXRoadService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('computeCountryResidence', () => {
    let now
    let ymd: { year: number; month: number; day: number }

    beforeEach(() => {
      now = new Date('2021-09-18T00:00:00')
      ymd = {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
      }
    })
    it('should work', async () => {
      const report = service.computeCountryResidence([
        {
          address: {},
          country: 'IS',
          dateOfChange: new Date(ymd.year - 2, ymd.month, ymd.day),
        },
      ])

      expect(report).toMatchObject({
        IS: 365,
      })
    })
  })
})
