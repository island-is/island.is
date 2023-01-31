import { Test } from '@nestjs/testing'
import { startMocking } from '@island.is/shared/mocking'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { LoggingModule } from '@island.is/logging'
import { DrivingLicenseBookClientApiFactory } from './drivingLicenseBookClient.service'
import { DrivingLicenseBookClientModule } from './drivingLicenseBookClient.module'
import { DrivingLicenseBookClientConfig } from './drivingLicenseBookClient.config'
import {
  MOCK_NATIONAL_ID_STUDENT,
  MOCK_NATIONAL_ID_TEACHER_INVALID,
  MOCK_NATIONAL_ID_TEACHER_NEW,
  MOCK_NATIONAL_ID_TEACHER_OLD,
  MOCK_USER,
  requestHandlers,
} from './__mock-data__/requestHandlers'

startMocking(requestHandlers)
describe('DrivingLicenseBookClientApiFactory', () => {
  let service: DrivingLicenseBookClientApiFactory

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
      providers: [DrivingLicenseBookClientApiFactory],
    }).compile()

    service = module.get(DrivingLicenseBookClientApiFactory)
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
