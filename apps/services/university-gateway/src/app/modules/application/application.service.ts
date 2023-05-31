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
    return {
      data: {
        id: id,
        universityId: uuid(),
        majorId: uuid(),
        studyType: StudyType.ON_SITE,
        status: ApplicationStatus.IN_REVIEW,
      },
    }
  }

  async createApplication(
    applicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const updatedApplication = {
      id: uuid(),
      universityId: applicationDto.universityId,
      majorId: applicationDto.majorId,
      studyType: applicationDto.studyType,
      status: ApplicationStatus.IN_REVIEW,
    }

    return updatedApplication
  }

  async updateApplicationStatus(
    id: string,
    applicationDto: UpdateApplicationStatusDto,
  ): Promise<Application> {
    const updatedApplication = {
      id: id,
      universityId: uuid(),
      majorId: uuid(),
      studyType: StudyType.ON_SITE,
      status: applicationDto.status,
    }

    return updatedApplication
  }

  async updateApplicationExtradata(
    id: string,
    applicationDto: UpdateApplicationExtradataDto,
  ): Promise<Application> {
    const updatedApplication = {
      id: id,
      universityId: uuid(),
      majorId: uuid(),
      studyType: StudyType.ON_SITE,
      status: ApplicationStatus.IN_REVIEW,
    }

    return updatedApplication
  }
}
