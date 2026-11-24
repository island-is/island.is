import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiRegistrationPostRequest,
  CompanyApi,
  CompanyDTO,
  CourseApi,
  CourseDTO,
  RegistrationApi,
  IndividualApi,
  IndividualDTO,
  IndividualCourseValidationDto,
  WorkMachineLicenseApi,
  WorkMachineLicenseDto,
  WorkMachineLicenseOrderApplicationApi,
  WorkMachineLicenseOrderApplicationDto,
} from '../../gen/fetch'

@Injectable()
export class SeminarsClientService {
  constructor(
    private readonly courseApi: CourseApi,
    private readonly companyApi: CompanyApi,
    private readonly registrationApi: RegistrationApi,
    private readonly individualApi: IndividualApi,
    private readonly workMachineLicenseApi: WorkMachineLicenseApi,
    private readonly workMachineLicenseOrderApplicationApi: WorkMachineLicenseOrderApplicationApi,
  ) {}

  private courseApiWithAuth = (user: User) =>
    this.courseApi.withMiddleware(new AuthMiddleware(user as Auth))
  private companyApiWithAuth = (user: User) =>
    this.companyApi.withMiddleware(new AuthMiddleware(user as Auth))
  private registrationApiWithAuth = (user: User) =>
    this.registrationApi.withMiddleware(new AuthMiddleware(user as Auth))
  private individualApiWithAuth = (user: User) =>
    this.individualApi.withMiddleware(new AuthMiddleware(user as Auth))
  private workMachineLicenseApiWithAuth = (user: User) =>
    this.workMachineLicenseApi.withMiddleware(new AuthMiddleware(user as Auth))
  private workMachineLicenseOrderApplicationApiWithAuth = (user: User) =>
    this.workMachineLicenseOrderApplicationApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getSeminar(auth: User, courseId: string): Promise<CourseDTO> {
    return this.courseApiWithAuth(auth).apiCourseCourseIdGet({
      courseId,
    })
  }

  async getAllSeminars(auth: User): Promise<Array<CourseDTO>> {
    return this.courseApiWithAuth(auth).apiCourseGet({})
  }

  async isCompanyValid(auth: User, nationalId: string): Promise<CompanyDTO> {
    return this.companyApiWithAuth(auth).apiCompanyGet({
      nationalId,
    })
  }

  async registerSeminar(
    auth: User,
    registration: ApiRegistrationPostRequest,
  ): Promise<void> {
    return this.registrationApiWithAuth(auth).apiRegistrationPost(registration)
  }

  async checkIndividuals(
    auth: User,
    individuals: Array<IndividualCourseValidationDto>,
    courseID: string,
    nationalIdOfRegisterer?: string,
  ): Promise<Array<IndividualDTO>> {
    return this.individualApiWithAuth(auth).apiIndividualPost({
      courseEligabilityDto: {
        courseId: courseID,
        nationalIdOfRegisterer,
        individuals: individuals.map((individual) => ({
          nationalId: individual.nationalId,
          email: individual.email,
        })),
      },
    })
  }

  async getWorkMachineLicense(
    auth: User,
    applicationId: string,
  ): Promise<WorkMachineLicenseDto> {
    return this.workMachineLicenseApiWithAuth(auth).apiWorkMachineLicenseGet({
      xCorrelationID: applicationId,
    })
  }

  async orderWorkMachineLicenseCard(
    auth: User,
    order: WorkMachineLicenseOrderApplicationDto,
  ): Promise<void> {
    return this.workMachineLicenseOrderApplicationApiWithAuth(
      auth,
    ).apiWorkMachineLicenseOrderApplicationPost({
      xCorrelationID: order.applicationId,
      workMachineLicenseOrderApplicationDto: order,
    })
  }
}
