import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { CourseApi, CourseDTO } from '../../gen/fetch'

@Injectable()
export class SeminarsClientService {
  constructor(private readonly namskeidApi: CourseApi) {}

  private namskeidApiWithAuth = (user: User) =>
    this.namskeidApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getSeminars(auth: User): Promise<Array<CourseDTO>> {
    return await this.namskeidApiWithAuth(auth).apiCourseGet()
  }
}
