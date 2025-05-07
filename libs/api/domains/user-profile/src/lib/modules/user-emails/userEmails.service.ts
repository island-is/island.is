import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { EmailsDto, V2MeEmailsApi } from '@island.is/clients/user-profile'
import { Injectable } from '@nestjs/common'
import { AddEmailInput } from '../../dto/addEmail.input'
import { AddEmail } from '../../models/addEmail.model'
import { DataStatus } from '../../types/dataStatus.enum'

@Injectable()
export class UserEmailsService {
  constructor(private v2EmailsApi: V2MeEmailsApi) {}

  v2EmailsApiWithAuth(auth: Auth) {
    return this.v2EmailsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getEmails(user: User): Promise<EmailsDto[]> {
    return this.v2EmailsApiWithAuth(user).emailsControllerFindAllByNationalId({
      nationalId: user.nationalId,
    })
  }

  async addEmail({ user, input }: { user: User; input: AddEmailInput }) {
    return this.v2EmailsApiWithAuth(user).emailsControllerCreateEmail({
      createEmailDto: input,
    })
  }

  async setPrimaryEmail({
    emailId,
  }: {
    emailId: string
    user: User
  }): Promise<AddEmail> {
    // TODO call rest api
    return {
      email: 'test@test.is',
      id: emailId,
      primary: true,
      emailStatus: DataStatus.VERIFIED,
    }
  }

  async deleteEmail({ emailId, user }: { emailId: string; user: User }) {
    return this.v2EmailsApiWithAuth(user).emailsControllerDeleteEmail({
      emailId,
    })
  }
}
