import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { Locale } from '@island.is/shared/types'
import {
  ApiExamCategoriesGetRequest,
  ApiExameeValidationPostRequest,
  ApiInstructorNationalIdGetRequest,
  ExamCategoriesApi,
  ExamCategoryDto,
  ExameeValidationApi,
  InstructorApi,
  WorkMachineExameeValidationDto,
  WorkMachineInstructorDto,
} from '../../gen/fetch'

@Injectable()
export class PracticalExamsClientService {
  constructor(
    private readonly examCategoriesApi: ExamCategoriesApi,
    private readonly examineeValidationApi: ExameeValidationApi,
    private readonly instructorApi: InstructorApi,
  ) {}
  private examCategoriesApiWithAuth = (user: User) =>
    this.examCategoriesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private exameeValidationApiWithAuth = (user: User) =>
    this.examineeValidationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private instructorApiWithAuth = (user: User) =>
    this.instructorApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getExamcategories(
    auth: User,
    requestParameters: ApiExamCategoriesGetRequest,
  ): Promise<Array<ExamCategoryDto>> {
    return await this.examCategoriesApiWithAuth(auth).apiExamCategoriesGet(
      requestParameters,
    )
  }

  async validateExaminee(
    auth: User,
    requestParameters: ApiExameeValidationPostRequest,
  ): Promise<WorkMachineExameeValidationDto> {
    return await this.exameeValidationApiWithAuth(auth).apiExameeValidationPost(
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
}
