import { Injectable } from '@nestjs/common'
import { Application, ApplicationResponse } from './model/application'
import { CreateApplicationDto } from './dto/createApplicationDto'
import { UpdateApplicationDto } from './dto/updateApplicationDto'
import { User } from '@island.is/auth-nest-tools'

// TODO connect to university APIs when POST endpoints from them are ready

@Injectable()
export class ApplicationService {
  async getApplication(id: string, user: User): Promise<ApplicationResponse> {
    throw Error('Not ready')
  }

  async createApplication(
    applicationDto: CreateApplicationDto,
    user: User,
  ): Promise<Application> {
    throw Error('Not ready')
  }

  async updateApplication(
    applicationId: string,
    applicationDto: UpdateApplicationDto,
    user: User,
  ): Promise<Application> {
    throw Error('Not ready')
  }
}
