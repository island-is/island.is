import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiExamCategoriesGetRequest,
  ApiInstructorNationalIdGetRequest,
  CompanyApi,
  ExamCategoriesApi,
  ExamCategoryDto,
  InstructorApi,
  WorkMachineInstructorDto,
  CompanyDto,
  ExamineeValidationApi,
  ExamineeEligibilityApi,
  WorkMachineExamineeValidationDto,
  ApiExamineeValidationPostRequest,
  ApiExamineeEligibilityGetRequest,
} from '../../gen/fetch'

@Injectable()
export class PracticalExamsClientService {
  constructor(
    private readonly examCategoriesApi: ExamCategoriesApi,
    private readonly examineeValidationApi: ExamineeValidationApi,
    private readonly instructorApi: InstructorApi,
    private readonly companyApi: CompanyApi,
    private readonly examineeEligibilityApi: ExamineeEligibilityApi,
  ) {}
  private examCategoriesApiWithAuth = (user: User) =>
    this.examCategoriesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private examineeEligibilityApiWithAuth = (user: User) =>
    this.examineeEligibilityApi.withMiddleware(new AuthMiddleware(user as Auth))

  private exameeValidationApiWithAuth = (user: User) =>
    this.examineeValidationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private instructorApiWithAuth = (user: User) =>
    this.instructorApi.withMiddleware(new AuthMiddleware(user as Auth))

  private companyApiWithAuth = (user: User) =>
    this.companyApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getExamcategories(
    auth: User,
    requestParameters: ApiExamCategoriesGetRequest,
  ): Promise<Array<ExamCategoryDto>> {
    return await this.examCategoriesApiWithAuth(auth).apiExamCategoriesGet(
      requestParameters,
    )
  }

  async isCompanyValid(auth: User, nationalId: string): Promise<CompanyDto> {
    return this.companyApiWithAuth(auth).apiCompanyNationalIdGet({
      nationalId,
    })
  }

  async examineeEligibility(
    auth: User,
    requestParameters: ApiExamineeEligibilityGetRequest,
  ) {
    console.log('PracticalExam.service.ts client', requestParameters)
    return await this.examineeEligibilityApiWithAuth(
      auth,
    ).apiExamineeEligibilityGet(requestParameters)
  }

  async validateExaminee(
    auth: User,
    requestParameters: ApiExamineeValidationPostRequest,
  ): Promise<WorkMachineExamineeValidationDto> {
    return await this.exameeValidationApiWithAuth(
      auth,
    ).apiExamineeValidationPost(requestParameters)
  }

  async validateInstructor(
    auth: User,
    requestParameters: ApiInstructorNationalIdGetRequest,
  ): Promise<WorkMachineInstructorDto> {
    return await this.instructorApiWithAuth(auth).apiInstructorNationalIdGet(
      requestParameters,
    )
  }
}
