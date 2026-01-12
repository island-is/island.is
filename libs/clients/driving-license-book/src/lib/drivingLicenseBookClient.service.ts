import {
  BookOverview,
  Configuration,
  DrivingLicenseBookApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
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

  private async getActiveBookId(nationalId: string): Promise<string | null> {
    const api = await this.create()
    const { data } = await api.apiStudentGetStudentActiveBookIdSsnGet({
      ssn: nationalId,
      licenseCategory: LICENSE_CATEGORY_B,
    })
    return data?.bookId || null
  }

  private async hasPracticeDriving(id: string): Promise<boolean> {
    const api = await this.create()
    const { data } = await api.apiStudentGetLicenseBookIdGet({ id })
    return data?.practiceDriving || false
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

  async getActiveStudentBook(user: User): Promise<BookOverview | undefined> {
    const api = await this.create()

    const { data } = await api.apiStudentGetStudentOverviewSsnGet({
      ssn: user.nationalId,
      showInactiveBooks: false,
    })

    const activeBook = data?.books
      ?.filter((item) => item.status !== 9)
      ?.reduce(
        (a, b) =>
          new Date(a.createdOn ?? '') > new Date(b.createdOn ?? '') ? a : b,
        {},
      )

    if (!activeBook?.id || !activeBook?.createdOn) {
      return undefined
    }

    return activeBook
  }

  async updateActiveStudentBookInstructor(
    user: User,
    newTeacherSsn: string,
  ): Promise<{ success: boolean }> {
    const api = await this.create()

    const activeBook = await this.getActiveStudentBook(user)
    if (!activeBook) {
      throw new NotFoundException(
        `Active book for national id ${user.nationalId} not found`,
      )
    }

    const { data } = await api.apiStudentGetStudentOverviewSsnGet({
      ssn: user.nationalId,
      showInactiveBooks: false,
    })

    const hasPracticeDriving = await this.hasPracticeDriving(
      activeBook.id || '',
    )

    try {
      await api.apiStudentUpdateLicenseBookIdPut({
        id: activeBook.id || '',
        digitalBookUpdateRequestBody: {
          createdOn: activeBook.createdOn || '',
          teacherSsn: newTeacherSsn,
          schoolSsn: activeBook.schoolSsn,
          studentEmail: data?.email,
          studentPrimaryPhoneNumber: data?.primaryPhoneNumber,
          studentSecondaryPhoneNumber: data?.secondaryPhoneNumber,
          practiceDriving: hasPracticeDriving,
        },
      })
      return { success: true }
    } catch (e) {
      return { success: false }
    }
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
