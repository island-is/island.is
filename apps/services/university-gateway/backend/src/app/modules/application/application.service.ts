import { Injectable } from '@nestjs/common'
import { Application, ApplicationResponse } from './model'
import { CreateApplicationDto, UpdateApplicationDto } from './dto'

// TODO connect to university APIs when POST endpoints from them are ready

@Injectable()
export class ApplicationService {
  async getApplication(id: string): Promise<ApplicationResponse> {
    throw Error('Not ready')
  }

  async createApplication(
    applicationDto: CreateApplicationDto,
  ): Promise<Application> {
    throw Error('Not ready')
  }

  async updateApplication(
    id: string,
    applicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    throw Error('Not ready')
  }
}
