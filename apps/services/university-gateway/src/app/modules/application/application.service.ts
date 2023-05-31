import { Injectable } from '@nestjs/common'
import { Application, ApplicationResponse } from './model'
import { uuid } from 'uuidv4'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { ApplicationStatus, StudyType } from './types'
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
  UpdateApplicationExtradataDto,
} from './dto'

// TODOx connect to ReykjavikUniversityClient and UniversityOfIcelandClient

@Injectable()
export class ApplicationService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getApplication(id: string): Promise<ApplicationResponse> {
    throw Error('Not ready')
  }

  async createApplication(
    applicationDto: CreateApplicationDto,
  ): Promise<Application> {
    throw Error('Not ready')
  }

  async updateApplicationStatus(
    id: string,
    applicationDto: UpdateApplicationStatusDto,
  ): Promise<Application> {
    throw Error('Not ready')
  }

  async updateApplicationExtradata(
    id: string,
    applicationDto: UpdateApplicationExtradataDto,
  ): Promise<Application> {
    throw Error('Not ready')
  }
}
