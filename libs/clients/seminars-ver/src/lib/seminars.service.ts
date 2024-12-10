import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { CompanyApi, CompanyDTO, CourseApi, CourseDTO } from '../../gen/fetch'

@Injectable()
export class SeminarsClientService {
  constructor(
    private readonly courseApi: CourseApi,
    private readonly companyApi: CompanyApi,
  ) {}

  private courseApiWithAuth = (user: User) =>
    this.courseApi.withMiddleware(new AuthMiddleware(user as Auth))
  private companyApiWithAuth = (user: User) =>
    this.companyApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getSeminar(auth: User, courseId: string): Promise<CourseDTO> {
    return await this.courseApiWithAuth(auth).apiCourseCourseIdGet({
      courseId,
    })
  }

  async isCompanyValid(auth: User, nationalId: string): Promise<CompanyDTO> {
    return await this.companyApiWithAuth(auth).apiCompanyGet({
      nationalId,
    })
  }
}
