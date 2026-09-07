import {
  Configuration,
  DigitalBook,
  DrivingLicenseBookApi,
} from '../../gen/fetch'
import { createEnhancedFetch, FetchError } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { DrivingLicenseBookClientConfig } from './drivingLicenseBookClient.config'
import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { AuthHeaderMiddleware, User } from '@island.is/auth-nest-tools'
import {
  AllowedPractieDrivingInput,
  CreateDrivingSchoolTestResultInput,
  CreatePracticalDrivingLessonInput,
  DeletePracticalDrivingLessonInput,
  DrivingLicenseBookStudent,
  DrivingLicenseBookStudentForTeacher,
  DrivingLicenseBookStudentInput,
  DrivingLicenseBookStudentOverview,
  DrivingLicenseBookStudentsInput,
  LICENSE_CATEGORY_B,
  LICENSE_CATEGORY_BE,
  Organization,
  PracticalDrivingLesson,
  PracticalDrivingLessonsInput,
  SchoolType,
  TeacherRights,
  UpdatePracticalDrivingLessonInput,
} from './drivingLicenseBookType.types'
import {
  drivingLessonMapper,
  getStudentAndBookMapper,
  getStudentForTeacherMapper,
  getStudentMapper,
  schoolForSchoolStaffMapper,
  schoolTypeMapper,
  teacherRightsMapper,
} from '../utils/mappers'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOGTAG = '[driving-license-book-client]'

// License categories that can have an active ökunám book in the
// change-instructor flow. A student may hold several at once (e.g. B and BE),
// so we look up the active book per category instead of guessing from the
// student overview. Extend this list as more categories start issuing digital
// books (e.g. advanced rights).
const UPDATE_INSTRUCTOR_LICENSE_CATEGORIES = [
  LICENSE_CATEGORY_B,
  LICENSE_CATEGORY_BE,
]

// An active book we can actually act on: it must have an id (to address the
// update) and a createdOn (the update endpoint requires a non-empty yyyy-MM-dd).
type ActiveLicenseBook = DigitalBook & { id: string; createdOn: string }

const isActiveLicenseBook = (
  book: DigitalBook | undefined,
): book is ActiveLicenseBook => !!book?.id && !!book?.createdOn

@Injectable()
export class DrivingLicenseBookClientApiFactory {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DrivingLicenseBookClientConfig.KEY)
    private clientConfig: ConfigType<typeof DrivingLicenseBookClientConfig>,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
  ) {}

  async create() {
    const api = new DrivingLicenseBookApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-driving-license-book',
          ...this.clientConfig.fetch,
        }),
        basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
        headers: {
          'X-Road-Client': this.xroadConfig.xRoadClient,
        },
      }),
    )

    const config = {
      username: this.clientConfig.username,
      password: this.clientConfig.password,
    }

    const { token } = await api.apiAuthenticationAuthenticatePost({
      authenticateModel: config,
    })
    if (token) {
      return api.withMiddleware(new AuthHeaderMiddleware(`Bearer ${token}`))
    } else {
      throw new Error(
        'Driving license book client configuration and login went wrong',
      )
    }
  }

  async createPracticalDrivingLesson(
    input: CreatePracticalDrivingLessonInput,
    user: User,
  ): Promise<Partial<Pick<PracticalDrivingLesson, 'id'>> | null> {
    const api = await this.create()
    const { data } = await api.apiTeacherCreatePracticalDrivingLessonPost({
      practicalDrivingLessonCreateRequestBody: {
        ...input,
        teacherSsn: user.nationalId,
      },
    })
    if (data && data.id) {
      return { id: data.id }
    }
    return null
  }

  async updatePracticalDrivingLesson(
    {
      bookId,
      id,
      minutes,
      createdOn,
      comments,
    }: UpdatePracticalDrivingLessonInput,
    user: User,
  ): Promise<{ success: boolean }> {
    const api = await this.create()
    const lesson: PracticalDrivingLesson[] =
      await this.getPracticalDrivingLessons({ bookId, id })
    if (lesson[0].teacherNationalId === user.nationalId) {
      try {
        await api.apiTeacherUpdatePracticalDrivingLessonIdPut({
          id: id,
          practicalDrivingLessonUpdateRequestBody: {
            minutes: minutes,
            createdOn: createdOn,
            comments: comments,
          },
        })
        return { success: true }
      } catch (e) {
        return { success: false }
      }
    }
    throw new ForbiddenException(
      `User ${user.nationalId} can not update practical driving lesson ${id}`,
    )
  }

  async deletePracticalDrivingLesson(
    { bookId, id, reason }: DeletePracticalDrivingLessonInput,
    user: User,
  ) {
    const api = await this.create()
    const lesson: PracticalDrivingLesson[] =
      await this.getPracticalDrivingLessons({ bookId, id })
    if (lesson[0].teacherNationalId === user.nationalId) {
      try {
        await api.apiTeacherDeletePracticalDrivingLessonIdDelete({ id, reason })
        return { success: true }
      } catch (e) {
        return { success: false }
      }
    }
    throw new ForbiddenException(
      `User ${user.nationalId} can not delete practical driving lesson ${id}`,
    )
  }

  async findStudent(
    input: DrivingLicenseBookStudentsInput,
  ): Promise<DrivingLicenseBookStudent[]> {
    try {
      const api = await this.create()
      const { data } = await api.apiStudentGetStudentListGet(input)
      if (!data) {
        this.logger.error(`${LOGTAG} Error fetching find student`)
        throw new NotFoundException(`Student not found drivingLicenseBook`)
      }
      return data
        .filter((student) => !!student && !!student.ssn && !!student.id)
        .map((student) => {
          return getStudentMapper(student)
        })
    } catch (e) {
      this.logger.error(`${LOGTAG} Error fetching find student`, e)
      throw new NotFoundException(`Student not found drivingLicenseBook`)
    }
  }

  async getStudentsForTeacher(
    user: User,
    licenseCategory: 'B' | 'BE',
  ): Promise<DrivingLicenseBookStudentForTeacher[]> {
    const api = await this.create()
    const { data } =
      await api.apiTeacherGetStudentOverviewForTeacherTeacherSsnGet({
        teacherSsn: user.nationalId,
        showExpired: false,
        licenseCategory: licenseCategory,
      })
    if (!data) {
      this.logger.error(`${LOGTAG} Error fetching students for teacher`)
      throw new NotFoundException(
        `Students for teacher with nationalId ${user.nationalId} not found`,
      )
    }
    // Remove nullish students, then map the students' fields to sane non-nullish values.
    // Note that id and nationalId are never missing in practice.
    return data
      .filter((student) => !!student && !!student.ssn && !!student.studentId)
      .map((student) => {
        return getStudentForTeacherMapper(student)
      })
  }

  async getStudent({
    nationalId,
    licenseCategory,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview> {
    const api = await this.create()
    const { data } = await api.apiStudentGetStudentOverviewSsnGet({
      ssn: nationalId,
      showInactiveBooks: false,
    })

    const book = licenseCategory
      ? data?.books?.find((book) => book.licenseCategory === licenseCategory)
      : data?.books?.[0]

    if (!book || !data) {
      this.logger.warn(
        `${LOGTAG} Error fetching student, student has no active book`,
      )
      throw new NotFoundException(
        `driving-license-book-client: Student has no active book`,
      )
    }
    return getStudentAndBookMapper(data, book)
  }

  async getMostRecentStudentBook({
    nationalId,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview | null> {
    const api = await this.create()
    const { data } = await api.apiStudentGetStudentOverviewSsnGet({
      ssn: nationalId,
      showInactiveBooks: false,
    })
    if (data?.books) {
      const filteredBooks = data.books.filter((item) => item.status !== 9)

      const book = filteredBooks.reduce(
        (a, b) =>
          new Date(a.createdOn ?? '') > new Date(b.createdOn ?? '') ? a : b,
        {},
      )

      if (!book) {
        return null
      }

      return getStudentAndBookMapper(data, book)
    }
    return null
  }

  async getSchoolForSchoolStaff(user: User): Promise<Organization> {
    const api = await this.create()
    const employee = await api.apiSchoolGetSchoolForSchoolStaffUserSsnGet({
      userSsn: user.nationalId,
    })
    if (!employee) {
      throw new NotFoundException(
        `School for user ${user.nationalId} not found`,
      )
    }
    const { data } = await api.apiSchoolGetSchoolTypesGet({
      licenseCategory: LICENSE_CATEGORY_B,
    })

    const allowedSchoolTypes = data
      ?.filter(
        (type) =>
          type?.schoolTypeCode &&
          employee.allowedDrivingSchoolTypes?.includes(type?.schoolTypeCode),
      )
      .map((type) => {
        return schoolTypeMapper(type)
      })

    return schoolForSchoolStaffMapper(employee, allowedSchoolTypes)
  }

  async isSchoolStaff(user: User): Promise<boolean> {
    const api = await this.create()
    const employee = await api.apiSchoolGetSchoolForSchoolStaffUserSsnGet({
      userSsn: user.nationalId,
    })
    if (!employee) {
      return false
    }
    return true
  }

  async createDrivingSchoolTestResult(
    input: CreateDrivingSchoolTestResultInput,
  ): Promise<{ id: string } | null> {
    const api = await this.create()
    const { data } = await api.apiSchoolCreateSchoolTestResultPost({
      schoolTestResultCreateRequestBody: {
        bookId: input.bookId,
        schoolTypeId: input.schoolTypeId,
        schoolSsn: input.schoolNationalId,
        schoolEmployeeSsn: input.schoolEmployeeNationalId,
        createdOn: input.createdOn,
        comments: input.comments,
      },
    })
    return data?.id ? { id: data.id } : null
  }

  async getPracticalDrivingLessons(
    input: PracticalDrivingLessonsInput,
  ): Promise<PracticalDrivingLesson[]> {
    const api = await this.create()
    const { data } = await api.apiTeacherGetPracticalDrivingLessonsBookIdGet(
      input,
    )
    if (!data) {
      throw new NotFoundException(
        `Practical driving lesson for id ${input.id} not found`,
      )
    }
    return data
      .filter(
        (practical) => !!practical && !!practical.bookId && !!practical.id,
      )
      .map((practical) => {
        return drivingLessonMapper(practical)
      })
  }

  async getSchoolTypes(): Promise<SchoolType[] | null> {
    const api = await this.create()
    const { data } = await api.apiSchoolGetSchoolTypesGet({
      licenseCategory: LICENSE_CATEGORY_B,
    })
    return (
      data?.map((type) => {
        return schoolTypeMapper(type)
      }) || null
    )
  }

  async allowPracticeDriving({
    teacherNationalId,
    studentNationalId,
  }: AllowedPractieDrivingInput) {
    const api = await this.create()
    try {
      await api.apiTeacherCreateAllowedPracticeDrivingPost({
        createAllowedPractieDrivingRequestBody: {
          teacherSsn: teacherNationalId,
          studentSsn: studentNationalId,
        },
      })
      return { success: true }
    } catch (e) {
      return { success: false }
    }
  }

  private async getActiveLicenseBookByCategory(
    api: DrivingLicenseBookApi,
    nationalId: string,
    licenseCategory: string,
  ): Promise<DigitalBook | undefined> {
    try {
      const { data } =
        await api.apiStudentGetStudentActiveLicenseBookBySsnSsnGet({
          ssn: nationalId,
          licenseCategory,
        })
      return data ?? undefined
    } catch (error) {
      // Only swallow the "no active book for this category" case – a student
      // may legitimately have a book in one category but not another. Any other
      // failure (401/403/5xx/timeout) must propagate, otherwise we could update
      // some of a student's books, miss others, and still report success.
      if (error instanceof FetchError && error.status === 404) {
        this.logger.debug(
          `${LOGTAG} No active ${licenseCategory} book for student`,
        )
        return undefined
      }
      throw error
    }
  }

  private async fetchActiveStudentBooks(
    api: DrivingLicenseBookApi,
    nationalId: string,
  ): Promise<ActiveLicenseBook[]> {
    const books = await Promise.all(
      UPDATE_INSTRUCTOR_LICENSE_CATEGORIES.map((licenseCategory) =>
        this.getActiveLicenseBookByCategory(api, nationalId, licenseCategory),
      ),
    )

    // Keep only usable books (id + createdOn) and de-duplicate in case the
    // backend returns the same book for more than one category.
    const seen = new Set<string>()
    return books.filter(isActiveLicenseBook).filter((book) => {
      if (seen.has(book.id)) {
        return false
      }
      seen.add(book.id)
      return true
    })
  }

  async getActiveStudentBook(user: User): Promise<DigitalBook | undefined> {
    const api = await this.create()
    const activeBooks = await this.fetchActiveStudentBooks(api, user.nationalId)

    if (activeBooks.length === 0) {
      return undefined
    }

    // When several categories are active, surface the most recently created
    // book (the instructor is shared across them in practice).
    return activeBooks.reduce(
      (mostRecent, book) =>
        new Date(book.createdOn) > new Date(mostRecent.createdOn)
          ? book
          : mostRecent,
      activeBooks[0],
    )
  }

  async updateActiveStudentBookInstructor(
    user: User,
    newTeacherSsn: string,
  ): Promise<{ success: boolean }> {
    const api = await this.create()

    const activeBooks = await this.fetchActiveStudentBooks(api, user.nationalId)
    if (activeBooks.length === 0) {
      throw new NotFoundException(
        `Active book for national id ${user.nationalId} not found`,
      )
    }

    // A student can be taking several categories (e.g. B and BE) at once –
    // update the instructor on every active book. Use allSettled so every PUT
    // is awaited even when one fails, and we can report exactly which book(s)
    // failed instead of aborting on the first rejection.
    const results = await Promise.allSettled(
      activeBooks.map((book) =>
        api.apiStudentUpdateLicenseBookIdPut({
          id: book.id,
          digitalBookUpdateRequestBody: {
            createdOn: book.createdOn,
            teacherSsn: newTeacherSsn,
            schoolSsn: book.schoolSsn,
            studentEmail: book.studentEmail,
            studentPrimaryPhoneNumber: book.studentPrimaryPhoneNumber,
            studentSecondaryPhoneNumber: book.studentSecondaryPhoneNumber,
            practiceDriving: book.practiceDriving,
          },
        }),
      ),
    )

    const failures = results.flatMap((result, index) =>
      result.status === 'rejected'
        ? [{ bookId: activeBooks[index].id, reason: result.reason }]
        : [],
    )

    if (failures.length > 0) {
      this.logger.error(
        `${LOGTAG} Error updating driving license book instructor`,
        failures,
      )
      return { success: false }
    }

    return { success: true }
  }

  async getTeacher(nationalId: string): Promise<TeacherRights> {
    const api = await this.create()
    return teacherRightsMapper(
      await api.apiTeacherGetTeacherSsnGet({
        ssn: nationalId,
      }),
    )
  }
}
