import { Inject, Injectable } from '@nestjs/common'
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
} from '@island.is/clients/driving-license-book'
import { StudentListInput } from './dto/studentList.input'
import { StudentListResponse } from './models/studentList.response'
import {
  Auth,
  AuthHeaderMiddleware,
  AuthMiddleware,
  User,
} from '@island.is/auth-nest-tools'

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
    data: StudentListInput,
  ): Promise<StudentListGetResponse> {
    const api = await this.apiWithAuth()
    return await api.apiStudentGetStudentListGet(data)
  }

  async getStudent(
    data: ApiStudentGetStudentOverviewSsnGetRequest,
  ): Promise<StudentOverviewGetResponse> {
    const api = await this.apiWithAuth()
    return await api.apiStudentGetStudentOverviewSsnGet(data)
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

  async getSchoolTestResultsBookId() {}
}
