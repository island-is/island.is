import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DrivingLicenseBookClientApiFactory } from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookStudentsInput } from './dto/students.input'
import { User } from '@island.is/auth-nest-tools'
import { DrivingLicenseBookStudentForTeacher } from './models/studentsTeacherNationalId.response'
import { DrivingLicenseBookStudentOverview } from './models/drivingBookStudentOverview.response'
import {
  LICENSE_CATEGORY,
  DrivingLicenseBookStudentForTeacherResponse,
} from './drivinLicenceBook.type'
import { DrivingLicenseBookStudent } from './models/drivingLicenseBookStudent.response'
import { PracticalDrivingLesson } from './models/practicalDrivingLesson.response'
import { DrivingLicenseBookStudentInput } from './dto/student.input'
import { CreatePracticalDrivingLessonInput } from './dto/createPracticalDrivingLesson.input'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'
import { DeletePracticalDrivingLessonInput } from './dto/deletePracticalDrivingLesson.input'
import { PracticalDrivingLessonsInput } from './dto/getPracticalDrivingLessons.input'

@Injectable()
export class DrivingLicenseBookService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DrivingLicenseBookClientApiFactory)
    private drivingLicenseBookClientApiFactory: DrivingLicenseBookClientApiFactory,
  ) {}

  async apiWithAuth() {
    return await this.drivingLicenseBookClientApiFactory.create()
  }

  async createPracticalDrivingLesson(
    input: CreatePracticalDrivingLessonInput,
    user: User,
  ): Promise<PracticalDrivingLesson | null> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiTeacherCreatePracticalDrivingLessonPost({
      practicalDrivingLessonCreateRequestBody: {
        ...input,
        teacherSsn: user.nationalId,
      },
    })
    if (data && data.id) {
      return { id: data?.id }
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
    const api = await this.apiWithAuth()
    const lesson: PracticalDrivingLesson[] = await this.getPracticalDrivingLessons(
      { bookId, id },
    )
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
    const api = await this.apiWithAuth()
    const lesson: PracticalDrivingLesson[] = await this.getPracticalDrivingLessons(
      { bookId, id },
    )
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
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentListGet(input)
    if (!data) {
      throw new NotFoundException(`Student not found drivingLicenseBook`)
    }
    return data.map((student) => ({
      id: student.id || undefined,
      nationalId: student.ssn || undefined,
      name: student.name || undefined,
      zipCode: student.zipCode || undefined,
      address: student.address || undefined,
      email: student.email || undefined,
      primaryPhoneNumber: student.primaryPhoneNumber || undefined,
      secondaryPhoneNumber: student.secondaryPhoneNumber || undefined,
      active: student.active || undefined,
      bookLicenseCategories: student.bookLicenseCategories || undefined,
    }))
  }

  async getStudentsForTeacher(
    user: User,
  ): Promise<DrivingLicenseBookStudentForTeacher[]> {
    const api = await this.apiWithAuth()
    const {
      data,
    } = await api.apiTeacherGetStudentOverviewForTeacherTeacherSsnGet({
      teacherSsn: user.nationalId,
    })
    if (!data) {
      throw new NotFoundException(
        `Students for teacher with nationalId ${user.nationalId} not found`,
      )
    }
    // Remove nullish students, then map the students' fields to sane non-nullish values.
    // Note that id and nationalId are never missing in practice.
    return data
      .filter(
        (student) =>
          (student ?? false) && !!student && student.ssn && !!student.studentId,
      )
      .map((student) => ({
        id: student.studentId ?? '-1',
        nationalId: student.ssn ?? '',
        name: student.name ?? '',
        totalLessonCount: student.totalLessonCount ?? 0,
      }))
  }

  async getStudent({
    nationalId,
  }: DrivingLicenseBookStudentInput): Promise<DrivingLicenseBookStudentOverview> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentOverviewSsnGet({
      ssn: nationalId,
    })
    if (data?.books && data?.ssn) {
      const activeBook = await this.getActiveBookId(data?.ssn)
      const book = data?.books.filter((b) => b.id === activeBook && !!b.id)[0]
      return {
        ...data,
        nationalId: data.ssn,
        teacherNationalId: book.teacherSsn,
        book: {
          ...book,
          id: book.id || undefined,
          teacherNationalId: book.teacherSsn || undefined,
          teachersAndLessons: book?.teachersAndLessons?.map((lesson) => ({
            ...lesson,
            teacherNationalId: lesson.teacherSsn,
          })),
        },
      } as DrivingLicenseBookStudentOverview
    }

    throw new NotFoundException(
      `Student for nationalId ${nationalId} not found`,
    )
  }

  async getPracticalDrivingLessons(
    input: PracticalDrivingLessonsInput,
  ): Promise<PracticalDrivingLesson[]> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiTeacherGetPracticalDrivingLessonsBookIdGet(
      input,
    )
    if (!data) {
      throw new NotFoundException(
        `Practical driving lesson for id ${input.id} not found`,
      )
    }
    return data.map((practical) => ({
      bookId: practical.bookId || undefined,
      id: practical.id || undefined,
      studentNationalId: practical.studentSsn || undefined,
      studentName: practical.studentName || undefined,
      licenseCategory: practical.licenseCategory || undefined,
      teacherNationalId: practical.teacherSsn || undefined,
      teacherName: practical.teacherName || undefined,
      minutes: practical.minutes,
      createdOn: practical.createdOn || undefined,
      comments: practical.comments || undefined,
    }))
  }

  private async getActiveBookId(nationalId: string): Promise<string | null> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentActiveBookIdSsnGet({
      ssn: nationalId,
      licenseCategory: LICENSE_CATEGORY,
    })
    return data?.bookId || null
  }
}
