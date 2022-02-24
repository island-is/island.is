import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DrivingLicenseBookClientService,
  StudentListGetResponse,
  ApiStudentGetLicenseBookIdGetRequest,
  DigitalBookGetResponse,
  ApiTeacherGetPracticalDrivingLessonsBookIdGetRequest,
  PracticalDrivingLessonGetResponse,
  ApiStudentGetStudentOverviewSsnGetRequest,
  StudentOverviewGetResponse,
  ApiTeacherCreatePracticalDrivingLessonPostRequest,
  PracticalDrivingLessonCreateResponse,
  ApiTeacherUpdatePracticalDrivingLessonIdPutRequest,
  ApiTeacherDeleteExemptionIdDeleteRequest,
  ApiStudentGetStudentActiveBookIdSsnGetRequest,
  StudentBookIdGetResponse,
  BookOverview,
} from '@island.is/clients/driving-license-book'
import { StudentListInput } from './dto/studentList.input'
import { User } from '@island.is/auth-nest-tools'
import { StudentListTeacherNationalIdResponse } from './models/studentsTeacherNationalId.response'
import { studentListTeacherNationalId } from './mock/studentListTeacherNationalId'
import { DrivingBookStudentOverview } from './models/drivingBookStudentOverview.response'
import { DrivingLicenseBook } from './models/drivingLicenseBook.response'
import { LICENSE_CATEGORY } from './drivinLicenceBook.type'
import { DrivingBookStudent } from './models/drivingBookStudent.response'
import { PracticalDrivingLesson } from './models/practicalDrivingLesson.response'
import { SuccessResponse } from './models/success.response'
import { StudentInput } from './dto/student.input'
import { CreatePracticalDrivingLesson } from './dto/createPracticalDrivingLesson.input'
import { UpdatePracticalDrivingLessonInput } from './dto/updatePracticalDrivingLesson.input'

@Injectable()
export class DrivingLicenseBookService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(DrivingLicenseBookClientService)
    private drivingLicenseBookClientService: DrivingLicenseBookClientService,
  ) {}

  async apiWithAuth() {
    return await this.drivingLicenseBookClientService.api()
  }
  async createPracticalDrivingLesson(
    input: CreatePracticalDrivingLesson,
  ): Promise<PracticalDrivingLesson | null> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiTeacherCreatePracticalDrivingLessonPost({
      practicalDrivingLessonCreateRequestBody: {
        ...input,
        teacherSsn: input.teacherNationalId,
      },
    })
    if (data && data.id) {
      return { id: data?.id }
    }
    return null
  }

  async updatePracticalDrivingLesson({
    id,
    minutes,
    createdOn,
    comments,
  }: UpdatePracticalDrivingLessonInput): Promise<{ success: boolean }> {
    try {
      const api = await this.apiWithAuth()
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

  async deletePracticalDrivingLesson(
    input: ApiTeacherDeleteExemptionIdDeleteRequest,
  ) {
    try {
      const api = await this.apiWithAuth()
      await api.apiTeacherDeletePracticalDrivingLessonIdDelete(input)
      return { success: true }
    } catch (e) {
      return { success: false }
    }
  }

  async getStudentList(
    input: StudentListInput,
  ): Promise<DrivingBookStudent[] | null> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentListGet(input)
    if (!data) {
      return null
    }
    return data as DrivingBookStudent[]
  }

  async getStudentListTeacherNationalId(
    user: User,
  ): Promise<StudentListTeacherNationalIdResponse> {
    return studentListTeacherNationalId
  }

  async getStudent({
    nationalId,
  }: StudentInput): Promise<DrivingBookStudentOverview | null> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentOverviewSsnGet({
      ssn: nationalId,
    })
    if (data?.books && data?.ssn) {
      const activeBook = await this.getActiveBookId({
        ssn: data?.ssn,
        licenseCategory: LICENSE_CATEGORY,
      })
      const book = data?.books.filter(
        (b) => b.id === activeBook,
      )[0] as DrivingLicenseBook
      return { ...data, book } as DrivingBookStudentOverview
    }

    return null
  }

  async getPracticalDrivingLessons(
    input: ApiTeacherGetPracticalDrivingLessonsBookIdGetRequest,
  ): Promise<PracticalDrivingLesson[]> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiTeacherGetPracticalDrivingLessonsBookIdGet(
      input,
    )
    if (data) {
      return data as PracticalDrivingLesson[]
    }
    throw new NotFoundException()
  }

  private async getActiveBookId(
    input: ApiStudentGetStudentActiveBookIdSsnGetRequest,
  ): Promise<string> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentActiveBookIdSsnGet(input)
    return data?.bookId ?? ''
  }
}
