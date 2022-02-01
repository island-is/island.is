import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { DrivingLicenseBookClientService } from '@island.is/clients/driving-license-book'
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

  async apiWithAuth(auth: Auth) {
    console.log('AUTH', auth.authorization)
    return await this.drivingLicenseBookClientService.api()
  }

  async getAllStudents(
    user: User,
    data: StudentListInput,
  ): Promise<StudentListResponse> {
    try {
      const api = await this.apiWithAuth(user)
      console.log('API', api)
      return await api.apiStudentGetStudentListGet(data)
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
