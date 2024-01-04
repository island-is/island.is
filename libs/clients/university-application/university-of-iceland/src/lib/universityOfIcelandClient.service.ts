import { Injectable } from '@nestjs/common'
import { CoursesApi, ProgramsApi } from '../../gen/fetch/apis'
import { ICourse, IProgram } from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { mapUglaPrograms } from './utils/mapUglaPrograms'
import { mapUglaCourses } from './utils/mapUglaCourses'

@Injectable()
export class UniversityOfIcelandApplicationClient {
  constructor(
    private readonly programsApi: ProgramsApi,
    private readonly coursesApi: CoursesApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.programsApi.activeProgramsGet()

    return mapUglaPrograms(res, (programExternalId: string, e: Error) => {
      logger.error(
        `Failed to map program with externalId ${programExternalId} (university-of-iceland), reason:`,
        e,
      )
    })
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
}
