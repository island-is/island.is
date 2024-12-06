import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  SchoolsApi,
  ProgrammesApi,
  ApplicationsApi,
} from '../../gen/fetch/apis'
import {
  Application,
  Program,
  SecondarySchool,
} from './secondarySchoolClient.types'

@Injectable()
export class SecondarySchoolClient {
  constructor(
    private readonly schoolsApi: SchoolsApi,
    private readonly programmesApi: ProgrammesApi,
    private readonly applicationsApi: ApplicationsApi,
  ) {}

  // private schoolsApiWithAuth(auth: Auth) {
  //   return this.schoolsApi.withMiddleware(new AuthMiddleware(auth))
  // }

  // private programmesApiWithAuth(auth: Auth) {
  //   return this.programmesApi.withMiddleware(new AuthMiddleware(auth))
  // }

  // private applicationsApiWithAuth(auth: Auth) {
  //   return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  // }

  async getSchools(): Promise<SecondarySchool[]> {
    const res = await this.schoolsApi.v1SchoolsGet({
      rowOffset: undefined,
      fetchSize: undefined,
    })

    return res.map((school) => ({
      id: school.schoolId || '',
      name: school.name || '',
      thirdLanguages:
        school.thirdLanguages?.map((language) => ({
          code: language.code || '',
          nameIs: language.name || '',
          nameEn: language.nameEnglish || '',
        })) || [],
    }))
  }

  async getPrograms(schoolId: string): Promise<Program[]> {
    const res = await this.programmesApi.v1ProgrammesGet({
      schoolId,
      rowOffset: undefined,
      fetchSize: undefined,
    })

    return res.map((program) => ({
      id: program.id || '',
      nameIs: program.title || '',
      nameEn: program.titleEnglish || '',
      registrationEndDate: program.registryEndDate || new Date(),
    }))
  }

  async validateCanCreate(auth: User): Promise<boolean> {
    // const res = await this.applicationsApi.v1ApplicationsGet({
    //   rowOffset: undefined,
    //   fetchSize: undefined,
    // })

    //TODOx get information about how we know if application is in progress
    return true
  }

  async delete(auth: User, applicationId: string): Promise<void> {
    this.applicationsApi.v1ApplicationsApplicationIdDelete({
      applicationId,
    })
  }

  async create(auth: User, application: Application): Promise<string> {
    const applicationId = await this.applicationsApi.v1ApplicationsPost({
      applicationBaseDto: {
        //TODOx add fields to create application
      },
    })

    await this.applicationsApi.v1ApplicationsApplicationIdAttachmentsPatch({
      applicationId,
      files: [], //TODOx add attachments
    })

    return applicationId
  }
}
