import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { HelloOddurApi, GetStatusApi, Status } from '../../gen/fetch'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly helloOddurApi: HelloOddurApi,
    private readonly getStatusApi: GetStatusApi,
  ) {}

  private testWithAuth = (user: User) =>
    this.helloOddurApi.withMiddleware(new AuthMiddleware(user as Auth))

  private statusAPIWithAuth = (user: User) =>
    this.getStatusApi.withMiddleware(new AuthMiddleware(user as Auth))

  /**
   * Hello world
   * @param user
   * @returns
   */
  async getOddur(user: User): Promise<string> {
    return await this.testWithAuth(user).helloOddur()
  }

  /**
   * Check if applicant has a application already at TR, if so in what statuses are they
   * @param user
   * @returns
   */
  async getStatus(user: User): Promise<Status> {
    console.log(
      '-------------------getStatus Begin #45----------------------------',
    )
    return await this.statusAPIWithAuth(user).getStatus()

    console.log(
      '-------------------getStatus DONE #45 ----------------------------',
    )
  }
}
