import { rest, RequestHandler } from 'msw'
import { Test } from '@nestjs/testing'
import { startMocking } from '@island.is/shared/mocking'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { LoggingModule } from '@island.is/logging'
import { DrivingLicenseBookClientApiFactory } from './drivingLicenseBookClient.service'
import { DrivingLicenseBookClientModule } from './drivingLicenseBookClient.module'
import { DrivingLicenseBookClientConfig } from './drivingLicenseBookClient.config'
import {
  MOCK_NATIONAL_ID_SCHOOL,
  MOCK_NATIONAL_ID_STUDENT,
  MOCK_NATIONAL_ID_TEACHER_INVALID,
  MOCK_NATIONAL_ID_TEACHER_NEW,
  MOCK_NATIONAL_ID_TEACHER_OLD,
  MOCK_USER,
  requestHandlers,
  url,
  XROAD_DRIVING_LICENSE_BOOK_PATH,
} from './__mock-data__/requestHandlers'

// startMocking returns the msw node server; narrow it so we can install
// per-test handler overrides.
const server = startMocking(requestHandlers) as unknown as {
  use: (...handlers: RequestHandler[]) => void
  resetHandlers: () => void
}

const activeLicenseBookUrl = url(
  `r1/${XROAD_DRIVING_LICENSE_BOOK_PATH}/api/Student/GetStudentActiveLicenseBookBySsn/:ssn`,
)
const updateLicenseBookUrl = url(
  `r1/${XROAD_DRIVING_LICENSE_BOOK_PATH}/api/Student/UpdateLicenseBook/:id`,
)

afterEach(() => server.resetHandlers())
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

  describe('getActiveStudentBook', () => {
    it('should return the active book with the current instructor', async () => {
      const response = await service.getActiveStudentBook(MOCK_USER)

      expect(response?.id).toBeTruthy()
      expect(response?.teacherSsn).toBe(MOCK_NATIONAL_ID_TEACHER_OLD)
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

    it('updates the instructor on every active book when several categories are active (B and BE)', async () => {
      const puts: { id: string; body: Record<string, unknown> }[] = []

      server.use(
        rest.get(activeLicenseBookUrl, (req, res, ctx) => {
          const licenseCategory = req.url.searchParams.get('licenseCategory')
          const book =
            licenseCategory === 'B'
              ? {
                  id: 'book-B',
                  licenseCategory: 'B',
                  createdOn: '2024-01-01',
                  schoolSsn: MOCK_NATIONAL_ID_SCHOOL,
                  teacherSsn: MOCK_NATIONAL_ID_TEACHER_OLD,
                  studentEmail: 'b@example.is',
                  practiceDriving: true,
                }
              : licenseCategory === 'BE'
              ? {
                  id: 'book-BE',
                  licenseCategory: 'BE',
                  createdOn: '2024-02-02',
                  schoolSsn: MOCK_NATIONAL_ID_SCHOOL,
                  teacherSsn: MOCK_NATIONAL_ID_TEACHER_OLD,
                  studentEmail: 'be@example.is',
                  practiceDriving: false,
                }
              : null
          return res(ctx.status(200), ctx.json({ data: book }))
        }),
        rest.put(updateLicenseBookUrl, async (req, res, ctx) => {
          puts.push({
            id: req.params.id as string,
            body: (await req.json()) as Record<string, unknown>,
          })
          return res(ctx.status(200))
        }),
      )

      const response = await service.updateActiveStudentBookInstructor(
        MOCK_USER,
        MOCK_NATIONAL_ID_TEACHER_NEW,
      )

      expect(response).toStrictEqual({ success: true })
      // Both the B and BE books are updated, each via its own PUT.
      expect(puts).toHaveLength(2)
      expect(puts.map((put) => put.id).sort()).toStrictEqual([
        'book-B',
        'book-BE',
      ])
      // Every book gets the new instructor...
      expect(
        puts.every(
          (put) => put.body.teacherSsn === MOCK_NATIONAL_ID_TEACHER_NEW,
        ),
      ).toBe(true)
      // ...while each book keeps its own details.
      const bookBE = puts.find((put) => put.id === 'book-BE')
      expect(bookBE?.body.createdOn).toBe('2024-02-02')
      expect(bookBE?.body.studentEmail).toBe('be@example.is')
      expect(bookBE?.body.practiceDriving).toBe(false)
    })

    it('still updates the B book when the BE lookup reports no active book (404)', async () => {
      const puts: string[] = []

      server.use(
        rest.get(activeLicenseBookUrl, (req, res, ctx) => {
          const licenseCategory = req.url.searchParams.get('licenseCategory')
          if (licenseCategory === 'B') {
            return res(
              ctx.status(200),
              ctx.json({
                data: {
                  id: 'book-B',
                  createdOn: '2024-01-01',
                  schoolSsn: MOCK_NATIONAL_ID_SCHOOL,
                  teacherSsn: MOCK_NATIONAL_ID_TEACHER_OLD,
                },
              }),
            )
          }
          return res(ctx.status(404), ctx.text('No active book'))
        }),
        rest.put(updateLicenseBookUrl, (req, res, ctx) => {
          puts.push(req.params.id as string)
          return res(ctx.status(200))
        }),
      )

      const response = await service.updateActiveStudentBookInstructor(
        MOCK_USER,
        MOCK_NATIONAL_ID_TEACHER_NEW,
      )

      expect(response).toStrictEqual({ success: true })
      expect(puts).toStrictEqual(['book-B'])
    })

    it('does not silently succeed when a category lookup fails unexpectedly', async () => {
      const puts: string[] = []

      server.use(
        rest.get(activeLicenseBookUrl, (req, res, ctx) => {
          const licenseCategory = req.url.searchParams.get('licenseCategory')
          if (licenseCategory === 'B') {
            return res(
              ctx.status(200),
              ctx.json({
                data: {
                  id: 'book-B',
                  createdOn: '2024-01-01',
                  schoolSsn: MOCK_NATIONAL_ID_SCHOOL,
                  teacherSsn: MOCK_NATIONAL_ID_TEACHER_OLD,
                },
              }),
            )
          }
          // Unexpected failure on the BE lookup (token/permission/server error).
          return res(ctx.status(500), ctx.text('Internal error'))
        }),
        rest.put(updateLicenseBookUrl, (req, res, ctx) => {
          puts.push(req.params.id as string)
          return res(ctx.status(200))
        }),
      )

      // Must reject rather than report success after updating only some books.
      await expect(
        service.updateActiveStudentBookInstructor(
          MOCK_USER,
          MOCK_NATIONAL_ID_TEACHER_NEW,
        ),
      ).rejects.toThrow()
    })
  })
})
