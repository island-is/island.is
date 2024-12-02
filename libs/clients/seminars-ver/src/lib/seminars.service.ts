import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { CourseApi, CourseDTO } from '../../gen/fetch'

@Injectable()
export class SeminarsClientService {
  constructor(private readonly namskeidApi: CourseApi) {}

  private namskeidApiWithAuth = (user: User) =>
    this.namskeidApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getSeminar(auth: User, courseId: number): Promise<CourseDTO> {
    return await this.namskeidApiWithAuth(auth).apiCourseCourseIdGet({
      courseId,
    })
  }
}
