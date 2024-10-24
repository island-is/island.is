import { Injectable } from '@nestjs/common'
import { ApplicationApi, ProgramsApi } from '../../gen/fetch/apis'
import {
  ApplicationStatus,
  IApplication,
  IProgram,
} from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { mapUglaPrograms } from './utils/mapUglaPrograms'
import { mapUglaApplication } from './utils/mapUglaApplication'
import { InlineResponse2004 } from '../../gen/fetch'

@Injectable()
export class UniversityOfIcelandApplicationClient {
  constructor(
    private readonly programsApi: ProgramsApi,
    private readonly applicationApi: ApplicationApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.programsApi.activeProgramsGet()

    return mapUglaPrograms(res, 'university-of-iceland')
  }

  async getApplicationStatus(externalId: string): Promise<ApplicationStatus> {
    // TODOx connect to HÍ API
    return ApplicationStatus.IN_REVIEW
  }

  async createApplication(
    application: IApplication,
  ): Promise<InlineResponse2004> {
    const mappedApplication = await mapUglaApplication(
      application,
      (e: Error) => {
        logger.error(
          `Failed to map application for user ${application.applicant.nationalId} to University of Iceland, reason:`,
          e,
        )
      },
    )

    return this.applicationApi.applicationsPost(mappedApplication)
  }

  async updateApplicationStatus(externalId: string, status: ApplicationStatus) {
    // TODOx connect to HÍ API
    return
  }
}
