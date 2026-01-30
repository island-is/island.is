import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { SchoolsApi, ApplicationsApi, StudentsApi } from '../../gen/fetch/apis'
import {
  Application,
  ApplicationPeriod,
  Program,
  SecondarySchool,
  Student,
} from './secondarySchoolClient.types'

@Injectable()
export class SecondarySchoolClient {
  constructor(
    private readonly applicationsApi: ApplicationsApi,
    private readonly schoolsApi: SchoolsApi,
    private readonly studentsApi: StudentsApi,
  ) {}

  private applicationsApiWithAuth(auth: Auth) {
    return this.applicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private schoolsApiWithAuth(auth: Auth) {
    return this.schoolsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private studentsApiWithAuth(auth: Auth) {
    return this.studentsApi.withMiddleware(new AuthMiddleware(auth))
  }

  // TODOx temporary untill API is ready
  async getApplicationPeriodInfo(_auth: User): Promise<ApplicationPeriod> {
    return {
      allowFreshmanApplication: true,
      registrationEndDateGeneral: new Date('2026-05-26'),
      registrationEndDateFreshman: new Date('2026-06-10'),
      reviewStartDateGeneral: new Date('2026-05-27'),
      reviewStartDateFreshman: new Date('2026-06-11'),
    }
  }

  async getStudentInfo(auth: User): Promise<Student> {
    const studentInfo = await this.studentsApiWithAuth(auth).v1StudentsInfoGet()
    return {
      hasActiveApplication: studentInfo?.hasActiveApplication || false,
      isFreshman: studentInfo?.isFreshman || false,
      externalIds: studentInfo?.applications || [],
    }
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
      nordicLanguages:
        school.nordicLanguages?.map((language) => ({
          code: language.code || '',
          name: language.name || '',
        })) || [],
      allowRequestDormitory: school.availableDormitory || false,
      isOpenForAdmissionGeneral: school.anyOpenForAdmissionGeneral || false,
      isOpenForAdmissionFreshman: school.anyOpenForAdmissionFreshman || false,
    }))
  }

  async getPrograms(
    auth: User,
    schoolId: string,
    isFreshman: boolean,
  ): Promise<Program[]> {
    const res = await this.schoolsApiWithAuth(
      auth,
    ).v1SchoolsSchoolIdProgrammesGet({
      schoolId,
      onlyFreshmenEnabled: isFreshman,
      rowOffset: undefined,
      fetchSize: undefined,
    })

    return res.map((program) => ({
      id: program.id || '',
      nameIs: `${program.title || ''} - ${program.code}`,
      nameEn: `${program.titleEnglish || program.title || ''} - ${
        program.code
      }`,
      registrationEndDate: program.registryEndDate || new Date(),
      isSpecialNeedsProgram: program.isSpecialNeedsProgramme || false,
    }))
  }

  async delete(auth: User, applicationId: string): Promise<void> {
    return this.applicationsApiWithAuth(
      auth,
    ).v1ApplicationsIslandIsApplicationIdDelete({
      islandIsApplicationId: applicationId,
    })
  }

  async getExternalId(
    auth: User,
    applicationId: string,
  ): Promise<string | undefined> {
    let externalId: string | undefined

    try {
      externalId = await this.applicationsApiWithAuth(
        auth,
      ).v1ApplicationsIslandIsApplicationIdIdGet({
        islandIsApplicationId: applicationId,
      })
    } catch (e) {
      if (e.response?.status !== 404) {
        // Rethrow if the error isn't due to the application not existing
        throw e
      }
    }

    // clean externalId and remove double quotes that is added by the openapi generator (bug in generator)
    return externalId?.replace(/['"]+/g, '')
  }

  async createOrUpdate(auth: User, application: Application): Promise<string> {
    const applicationBaseDto = {
      islandIsApplicationId: application.id,
      applicantNationalId: application.nationalId,
      applicantName: application.name,
      applicantGender: application.genderCode,
      isFreshman: application.isFreshman,
      phoneNumber: application.phone,
      email: application.email,
      placeOfResidence: application.address,
      postCode: application.postalCode,
      municipality: application.city,
      nextOfKin: application.contacts.map((contact) => ({
        nationalId: contact.nationalId,
        phoneNumber: contact.phone,
        name: contact.name,
        email: contact.email,
        address: contact.address,
        postCode: contact.postalCode,
      })),
      speakingLanguage: application.nativeLanguageCode,
      otherInformation: application.otherDescription,
      schoolChoices: application.schools.map((school) => ({
        priority: school.priority,
        schoolId: school.schoolId,
        programmeChoices: school.programs.map((program) => ({
          priority: program.priority,
          programmeId: program.programId,
        })),
        thirdLanguage: school.thirdLanguageCode,
        northernLanguage: school.nordicLanguageCode,
        requestDormitory: school.requestDormitory,
      })),
      attachments: application.attachments,
    }

    if (application.externalId) {
      try {
        await this.applicationsApiWithAuth(
          auth,
        ).v1ApplicationsIslandIsApplicationIdPut({
          islandIsApplicationId: application.id,
          applicationBaseDto,
        })

        return application.externalId
      } catch (error) {
        throw new Error(`Failed to update application: ${error.message}`)
      }
    } else {
      try {
        const result = await this.applicationsApiWithAuth(
          auth,
        ).v1ApplicationsPost({
          applicationBaseDto,
        })

        if (!result.id) {
          throw new Error('Application creation failed: No ID returned')
        }

        // Return external ID
        return result.id
      } catch (error) {
        throw new Error(`Failed to create application: ${error.message}`)
      }
    }
  }
}
