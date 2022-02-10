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
import { StudentListTeacherSsnResponse } from './models/studentsTeacherSsn.response'
import { studentListTeacherSsn } from './mock/studentListTeacherSsn'
import { StudentOverViewResponse } from './models/student.response'
import { DrivingLicenseBook } from './models/drivingLicenseBook.response'
import { LICENSE_CATEGORY } from './drivinLicenceBook.type'

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
    input: ApiTeacherCreatePracticalDrivingLessonPostRequest,
  ): Promise<PracticalDrivingLessonCreateResponse> {
    const api = await this.apiWithAuth()
    return await api.apiTeacherCreatePracticalDrivingLessonPost(input)
  }

  async updatePracticalDrivingLesson(
    input: ApiTeacherUpdatePracticalDrivingLessonIdPutRequest,
  ): Promise<{ success: boolean }> {
    try {
      const api = await this.apiWithAuth()
      await api.apiTeacherUpdatePracticalDrivingLessonIdPut(input)
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
  ): Promise<StudentListGetResponse> {
    const api = await this.apiWithAuth()
    return await api.apiStudentGetStudentListGet(input)
  }

  async getStudentListTeacherSsn(
    user: User,
  ): Promise<StudentListTeacherSsnResponse> {
    return studentListTeacherSsn
  }

  async getStudent(
    input: ApiStudentGetStudentOverviewSsnGetRequest,
  ): Promise<StudentOverViewResponse> {
    const api = await this.apiWithAuth()
    const { data } = await api.apiStudentGetStudentOverviewSsnGet(input)
    if (data?.books && data?.ssn) {
      const bookId = await this.getActiveBookId({
        ssn: data?.ssn,
        licenseCategory: LICENSE_CATEGORY,
      })
      const book = data?.books.filter(
        (b) => b.id === bookId.data?.bookId,
      )[0] as DrivingLicenseBook
      return { data: { ...data, book } } as StudentOverViewResponse
    }

    throw new NotFoundException()
  }

  // The following all show data available in the get student query so maybe not needed
  async getLicenseBookId(
    input: ApiStudentGetLicenseBookIdGetRequest,
  ): Promise<DigitalBookGetResponse> {
    const api = await this.apiWithAuth()
    return await api.apiStudentGetLicenseBookIdGet(input)
  }

  async getPracticalDrivingLessonsBookId(
    input: ApiTeacherGetPracticalDrivingLessonsBookIdGetRequest,
  ): Promise<PracticalDrivingLessonGetResponse> {
    const api = await this.apiWithAuth()
    return await api.apiTeacherGetPracticalDrivingLessonsBookIdGet(input)
  }

  async getActiveBookId(
    input: ApiStudentGetStudentActiveBookIdSsnGetRequest,
  ): Promise<StudentBookIdGetResponse> {
    const api = await this.apiWithAuth()
    return await api.apiStudentGetStudentActiveBookIdSsnGet(input)
  }
}
