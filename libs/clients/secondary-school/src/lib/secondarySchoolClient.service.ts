import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { SchoolsApi, ApplicationsApi } from '../../gen/fetch/apis'
import {
  Application,
  Program,
  SecondarySchool,
} from './secondarySchoolClient.types'
import { getAllLanguageCodes } from '@island.is/shared/utils'

@Injectable()
export class SecondarySchoolClient {
  constructor(
    private readonly schoolsApi: SchoolsApi,
    private readonly applicationsApi: ApplicationsApi,
  ) {}

  private schoolsApiWithAuth(auth: Auth) {
    return this.schoolsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private applicationsApiWithAuth(auth: Auth) {
    return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getSchools(auth: User): Promise<SecondarySchool[]> {
    const res = await this.schoolsApiWithAuth(auth).v1SchoolsGet({
      rowOffset: undefined,
      fetchSize: undefined,
    })

    return res.map((school) => ({
      id: school.schoolId || '',
      name: school.name || '',
      thirdLanguages:
        school.thirdLanguages?.map((language) => ({
          code: language.code || '',
          name: language.name || '',
        })) || [],
      // TODOx vantar í API - nordicLanguages
      nordicLanguages: getAllLanguageCodes().filter((x) =>
        ['sv', 'no', 'fi'].includes(x.code),
      ),
      // TODOx vantar í API - allowRequestDormitory
      allowRequestDormitory: false,
    }))
  }

  async getPrograms(auth: User, schoolId: string): Promise<Program[]> {
    //TODOx this needs to send us registrationEndDate for both almenn and nýnemi
    // const res = await this.schoolsApiWithAuth(
    //   auth,
    // ).v1SchoolsSchoolIdProgrammesGet({
    //   schoolId,
    //   rowOffset: undefined,
    //   fetchSize: undefined,
    // })

    // return res.map((program) => ({
    //   id: program.id || '',
    //   nameIs: program.title || '',
    //   nameEn: program.titleEnglish || '',
    //   registrationEndDate: program.registryEndDate || new Date(),
    // }))

    //TODOx
    return [
      {
        id: schoolId + '1',
        nameIs: 'Náttúrufræðibraut',
        nameEn: '',
        registrationEndDate: new Date('2025-06-01'),
      },
      {
        id: schoolId + '2',
        nameIs: 'Félagsfræðibraut',
        nameEn: '',
        registrationEndDate: new Date('2025-06-01'),
      },
    ]
  }

  async validateCanCreate(auth: User): Promise<boolean> {
    // const res = await this.applicationsApi.v1ApplicationsGet({
    //   rowOffset: undefined,
    //   fetchSize: undefined,
    // })

    //TODOx vantar í API - get information about how we know if application is in progress
    return true
  }

  async delete(auth: User, applicationId: string): Promise<void> {
    this.applicationsApiWithAuth(auth).v1ApplicationsApplicationIdDelete({
      applicationId,
    })
  }

  async create(auth: User, application: Application): Promise<string> {
    // const applicationId = await this.applicationsApiWithAuth(
    //   auth,
    // ).v1ApplicationsPost({
    //   applicationBaseDto: {
    //     applicantNationalId: application.nationalId,
    //     applicantName: application.name,
    //     phoneNumber: application.phone,
    //     email: application.email,
    //     placeOfResidence: application.address,
    //     postCode: application.postalCode,
    //     municipality: application.city,
    //     nextOfKin: application.contacts.map((contact) => ({
    //       nationalId: contact.nationalId,
    //       phoneNumber: contact.phone,
    //       name: contact.name,
    //       email: contact.email,
    //       address: contact.address,
    //       postCode: contact.postalCode,
    //     })),
    //     speakingLanguage: application.nativeLanguageCode,
    //     otherInformation: application.otherDescription,
    //     applicationChoices: application.schools.map((school) => ({
    //       priority: school.priority,
    //       schoolId: school.schoolId,
    //       programmeChoice: school.programs.map((program) => ({
    //         priority: program.priority,
    //         programmeId: program.programId,
    //       })),
    //       thirdLanguages: school.thirdLanguageCode,
    //       northernLanguage: school.nordicLanguageCode,
    //       requestDormitory: school.requestDormitory,
    //     })),
    //     //TODOx vantar í API - missing applicationType
    //   },
    // })

    // await this.applicationsApiWithAuth(
    //   auth,
    // ).v1ApplicationsApplicationIdAttachmentsPatch({
    //   applicationId,
    //   files: application.attachments
    //     .filter((x) => !!x)
    //     .map((x) => this.base64ToBlob(x.fileContent)),
    // })

    // return applicationId

    return 'TODOx'
  }

  private base64ToBlob(base64: string): Blob {
    const byteCharacters = Buffer.from(base64, 'base64')
    return new Blob([byteCharacters])
  }
}
