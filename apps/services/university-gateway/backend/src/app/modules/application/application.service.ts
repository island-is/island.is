import { Injectable } from '@nestjs/common'
import { Application, ApplicationResponse } from './model'
import { UniversityGatewayReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { CreateApplicationDto, UpdateApplicationDto } from './dto'

// TODO connect to university APIs when POST endpoints from them are ready

@Injectable()
export class ApplicationService {
  constructor(
    private readonly reykjavikUniversityClient: UniversityGatewayReykjavikUniversityClient,
  ) {}

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
