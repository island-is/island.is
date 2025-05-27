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
  ExamRegistrationApi,
  ApiExamRegistrationPostRequest,
  PostCodeApi,
  ApiPostCodeGetRequest,
  ExamineeEligibilityDto,
  PostCodeDto,
} from '../../gen/fetch'

@Injectable()
export class PracticalExamsClientService {
  constructor(
    private readonly examCategoriesApi: ExamCategoriesApi,
    private readonly examineeValidationApi: ExamineeValidationApi,
    private readonly instructorApi: InstructorApi,
    private readonly companyApi: CompanyApi,
    private readonly examineeEligibilityApi: ExamineeEligibilityApi,
    private readonly examRegistrationApi: ExamRegistrationApi,
    private readonly postCodeApi: PostCodeApi,
  ) {}
  private examCategoriesApiWithAuth = (user: User) =>
    this.examCategoriesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private examRegistrationApiWithAuth = (user: User) =>
    this.examRegistrationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private examineeEligibilityApiWithAuth = (user: User) =>
    this.examineeEligibilityApi.withMiddleware(new AuthMiddleware(user as Auth))

  private exameeValidationApiWithAuth = (user: User) =>
    this.examineeValidationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private instructorApiWithAuth = (user: User) =>
    this.instructorApi.withMiddleware(new AuthMiddleware(user as Auth))

  private companyApiWithAuth = (user: User) =>
    this.companyApi.withMiddleware(new AuthMiddleware(user as Auth))

  private postCodeApiWithAuth = (user: User) =>
    this.postCodeApi.withMiddleware(new AuthMiddleware(user as Auth))

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
  ): Promise<Array<ExamineeEligibilityDto>> {
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

  async submitPracticalExamApplication(
    auth: User,
    requestParameters: ApiExamRegistrationPostRequest,
  ): Promise<void> {
    return await this.examRegistrationApiWithAuth(auth).apiExamRegistrationPost(
      requestParameters,
    )
  }

  async validateInstructor(
    auth: User,
    requestParameters: ApiInstructorNationalIdGetRequest,
  ): Promise<WorkMachineInstructorDto> {
    return await this.instructorApiWithAuth(auth).apiInstructorNationalIdGet(
      requestParameters,
    )
  }

  async getPostcodes(
    auth: User,
    requestParameters: ApiPostCodeGetRequest,
  ): Promise<Array<PostCodeDto>> {
    return await this.postCodeApiWithAuth(auth).apiPostCodeGet(
      requestParameters,
    )
  }
}
