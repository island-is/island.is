import { Test } from '@nestjs/testing'
import { CriminalRecordService } from './criminalRecord.service'
import { CriminalRecordApiModule } from '@island.is/clients/criminal-record'
import {
  MOCK_NATIONAL_ID,
  MOCK_NATIONAL_ID_NOT_EXISTS,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { startMocking } from '@island.is/shared/mocking'
import { ConfigModule } from '@nestjs/config'
import { defineConfig } from '@island.is/nest/config'

startMocking(requestHandlers)

describe('CriminalRecordService', () => {
  let service: CriminalRecordService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        CriminalRecordApiModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            defineConfig({
              name: 'CriminalRecordClient',
              load: () => ({
                xRoadServicePath: 'v2',
              }),
            }),
            defineConfig({
              name: 'XRoadConfig',
              load: () => ({
                xRoadBasePath: 'http://localhost',
                xRoadClient: '',
              }),
            }),
          ],
        }),
      ],
      providers: [CriminalRecordService, { provide: 'CONFIG', useValue: {} }],
    }).compile()

    service = module.get(CriminalRecordService)
  })

  describe('Module', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getCriminalRecord', () => {
    it('should return a result', async () => {
      const response = await service.getCriminalRecord(MOCK_NATIONAL_ID)

      expect(response.contentBase64).toBeTruthy()
    })

    it('should throw an error', async () => {
      return await service
        .getCriminalRecord(MOCK_NATIONAL_ID_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })

  describe('validateCriminalRecord', () => {
    it('should not throw an error', async () => {
      expect(async () => {
        await service.validateCriminalRecord(MOCK_NATIONAL_ID)
      }).not.toThrowError()
    })

    it('should throw an error', async () => {
      return await service
        .validateCriminalRecord(MOCK_NATIONAL_ID_NOT_EXISTS)
        .catch((e) => {
          expect(e).toBeTruthy()
          expect.assertions(1)
        })
    })
  })
})
