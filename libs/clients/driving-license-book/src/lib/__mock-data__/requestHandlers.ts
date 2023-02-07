import { rest } from 'msw'
import type { User } from '@island.is/auth-nest-tools'

export const MOCK_LICENSE_BOOK_ID = '0'
export const MOCK_NATIONAL_ID_STUDENT = '1'
export const MOCK_NATIONAL_ID_TEACHER_OLD = '2'
export const MOCK_NATIONAL_ID_TEACHER_NEW = '3'
export const MOCK_NATIONAL_ID_TEACHER_INVALID = '4'
export const MOCK_NATIONAL_ID_SCHOOL = '5'

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_DRIVING_LICENSE_BOOK_PATH =
  'IS-DEV/GOV/10017/Samgongustofa-Protected/Okunamsbok-V1'

export const MOCK_USER = {
  nationalId: MOCK_NATIONAL_ID_STUDENT,
  scope: ['test-scope-1'],
  client_id: 'test-client',
  authorization: '',
  client: '',
  ip: '',
  userAgent: '',
} as User

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.post(
    url(
      `r1/${XROAD_DRIVING_LICENSE_BOOK_PATH}/api/Authentication/Authenticate`,
    ),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ token: '12345' }))
    },
  ),
  rest.get(
    url(
      `r1/${XROAD_DRIVING_LICENSE_BOOK_PATH}/api/Student/GetStudentOverview/:ssn`,
    ),
    (req, res, ctx) => {
      const isFound = req.params.ssn === MOCK_NATIONAL_ID_STUDENT
      if (!isFound) {
        return res(
          ctx.status(404),
          ctx.text('Student overview not found for this student SSN'),
        )
      }

      return res(
        ctx.status(200),
        ctx.json({
          data: {
            ssn: MOCK_NATIONAL_ID_STUDENT,
            email: null,
            primaryPhoneNumber: null,
            secondaryPhoneNumber: null,
            books: [
              {
                id: MOCK_LICENSE_BOOK_ID,
                createdOn: new Date(),
                schoolSsn: MOCK_NATIONAL_ID_SCHOOL,
                teacherSsn: MOCK_NATIONAL_ID_TEACHER_OLD,
              },
            ],
          },
        }),
      )
    },
  ),
  rest.get(
    url(`r1/${XROAD_DRIVING_LICENSE_BOOK_PATH}/api/Student/GetLicenseBook/:id`),
    (req, res, ctx) => {
      const isFound = req.params.id === MOCK_LICENSE_BOOK_ID
      if (!isFound) {
        return res(
          ctx.status(404),
          ctx.text('License book not found for this book ID'),
        )
      }

      return res(ctx.status(200), ctx.json({ data: { practiceDriving: true } }))
    },
  ),
  rest.put(
    url(
      `r1/${XROAD_DRIVING_LICENSE_BOOK_PATH}/api/Student/UpdateLicenseBook/:id`,
    ),
    (req, res, ctx) => {
      const body = req.body as { teacherSsn: string } | undefined | null

      const isFound = req.params.id === MOCK_LICENSE_BOOK_ID
      if (!isFound) {
        return res(
          ctx.status(404),
          ctx.text('License book not found for this book ID'),
        )
      }

      const isValidTeacher = [
        MOCK_NATIONAL_ID_TEACHER_OLD,
        MOCK_NATIONAL_ID_TEACHER_NEW,
      ].includes(body?.teacherSsn || '')
      if (!isValidTeacher) {
        return res(
          ctx.status(400),
          ctx.text('Teacher rights not found for this teacher SSN'),
        )
      }

      return res(ctx.status(200))
    },
  ),
]
