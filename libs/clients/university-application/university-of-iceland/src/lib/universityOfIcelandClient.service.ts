import { Injectable } from '@nestjs/common'
import { ApplicationApi, CoursesApi, ProgramsApi } from '../../gen/fetch/apis'
import {
  ApplicationStatus,
  IApplication,
  ICourse,
  IProgram,
} from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { mapUglaPrograms } from './utils/mapUglaPrograms'
import { mapUglaCourses } from './utils/mapUglaCourses'
import { mapUglaApplication } from './utils/mapUglaApplication'
import { InlineResponse2004 } from '../../gen/fetch'

@Injectable()
export class UniversityOfIcelandApplicationClient {
  constructor(
    private readonly programsApi: ProgramsApi,
    private readonly coursesApi: CoursesApi,
    private readonly applicationApi: ApplicationApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.programsApi.activeProgramsGet()

    return mapUglaPrograms(res, 'university-of-iceland')
  }

  async getCourses(programExternalId: string): Promise<ICourse[]> {
    const res = await this.coursesApi.programExternalIdCoursesGet({
      externalId: programExternalId,
      // specializationExternalId // TODO missing in api
    })

    return mapUglaCourses(res, (courseExternalId: string, e: Error) => {
      logger.error(
        `Failed to map course with externalId ${courseExternalId} for program with externalId ${programExternalId} (university-of-iceland), reason:`,
        e,
      )
    })
  }

  async getApplicationStatus(externalId: string): Promise<ApplicationStatus> {
    // TODO connect to HÍ API
    return ApplicationStatus.IN_REVIEW
  }

  async createApplication(
    application: IApplication,
  ): Promise<InlineResponse2004> {
    const mappedApplication = await mapUglaApplication(
      application,
      (courseExternalId: string, e: Error) => {
        logger.error(
          `Failed to map application for user ${application.applicant.nationalId} to University of Iceland, reason:`,
          e,
        )
      },
    )

    return this.applicationApi.applicationsPost(mappedApplication)
  }

  async updateApplicationStatus(externalId: string, status: ApplicationStatus) {
    // TODO connect to HÍ API
    return
  }
}
