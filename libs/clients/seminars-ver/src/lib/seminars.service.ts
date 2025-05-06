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
} from '../../gen/fetch'

@Injectable()
export class SeminarsClientService {
  constructor(
    private readonly courseApi: CourseApi,
    private readonly companyApi: CompanyApi,
    private readonly registrationApi: RegistrationApi,
    private readonly individualApi: IndividualApi,
  ) {}

  private courseApiWithAuth = (user: User) =>
    this.courseApi.withMiddleware(new AuthMiddleware(user as Auth))
  private companyApiWithAuth = (user: User) =>
    this.companyApi.withMiddleware(new AuthMiddleware(user as Auth))
  private registrationApiWithAuth = (user: User) =>
    this.registrationApi.withMiddleware(new AuthMiddleware(user as Auth))
  private individualApiWithAuth = (user: User) =>
    this.individualApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getSeminar(auth: User, courseId: string): Promise<CourseDTO> {
    return this.courseApiWithAuth(auth).apiCourseCourseIdGet({
      courseId,
    })
  }

  async getAllSeminars(auth: User): Promise<Array<CourseDTO>> {
    return this.courseApiWithAuth(auth).apiCourseGet()
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
}
