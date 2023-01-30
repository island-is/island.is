import { Test } from '@nestjs/testing'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'
import {
  DrivingLicenseBookClientApiFactory,
  DrivingLicenseBookClientModule,
  DrivingLicenseBookClientConfig,
} from '@island.is/clients/driving-license-book'
import { startMocking } from '@island.is/shared/mocking'
import {
  MOCK_NATIONAL_ID_STUDENT,
  MOCK_NATIONAL_ID_TEACHER_INVALID,
  MOCK_NATIONAL_ID_TEACHER_NEW,
  MOCK_NATIONAL_ID_TEACHER_OLD,
  MOCK_USER,
  requestHandlers,
} from './__mock-data__/requestHandlers'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { LoggingModule } from '@island.is/logging'

startMocking(requestHandlers)
describe('DrivingLicenseBookService', () => {
  let service: DrivingLicenseBookService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, DrivingLicenseBookClientConfig],
        }),
        DrivingLicenseBookClientModule,
      ],
      providers: [
        DrivingLicenseBookClientApiFactory,
        DrivingLicenseBookService,
      ],
    }).compile()

    service = module.get(DrivingLicenseBookService)
  })

  describe('Service', () => {
    it('should be defined', () => {
      expect(service).toBeTruthy()
    })
  })

  describe('getMostRecentStudentBook', () => {
    it('should return a book', async () => {
      const response = await service.getMostRecentStudentBook({
        nationalId: MOCK_NATIONAL_ID_STUDENT,
      })

      expect(response?.book?.id).toBeTruthy()
    })

    it('should have old teacher selected in book', async () => {
      const response = await service.getMostRecentStudentBook({
        nationalId: MOCK_NATIONAL_ID_STUDENT,
      })

      expect(
        response?.book?.teacherNationalId === MOCK_NATIONAL_ID_TEACHER_OLD,
      ).toBeTruthy()
    })
  })

  describe('updateActiveStudentBookInstructor', () => {
    it('student should be able to update the instructor with a valid instructor national id', async () => {
      const response = await service.updateActiveStudentBookInstructor(
        MOCK_USER,
        MOCK_NATIONAL_ID_TEACHER_NEW,
      )

      expect(response).toStrictEqual({
        success: true,
      })
    })

    it('student should not be able to update the instructor with an invalid instructor national id', async () => {
      const response = await service.updateActiveStudentBookInstructor(
        MOCK_USER,
        MOCK_NATIONAL_ID_TEACHER_INVALID,
      )

      expect(response).toStrictEqual({
        success: false,
      })
    })
  })
})
