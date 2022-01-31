import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {DrivingLicenseBookApi} from '@island.is/clients/driving-license-book'
import { StudentListInput } from './dto/studentList.input'
import { StudentListResponse } from './models/studentList.response'
import { Auth, AuthHeaderMiddleware, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class DrivingLicenseBookService {
    constructor(
        @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
        private drivingLicenseBookApi: DrivingLicenseBookApi
    ) {}

    apiWithAuth(auth: Auth) {
        console.log("AUTH", auth.authorization)
       return this.drivingLicenseBookApi.withMiddleware(new AuthHeaderMiddleware(auth.authorization))
    }

    async getAllStudents( user: User, data: StudentListInput): Promise<StudentListResponse>{
        try {
            const api = this.apiWithAuth(user)
            console.log("API",api)
            return await this.apiWithAuth(user).apiStudentGetStudentListGet(data)

        } catch (e) {
            console.log(e)
            throw e
        }
    }
}