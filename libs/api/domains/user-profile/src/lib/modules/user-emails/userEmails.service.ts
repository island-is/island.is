import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  EmailsDto,
  V2ActorApi,
  V2MeApi,
  V2MeEmailsApi,
} from '@island.is/clients/user-profile'
import { Injectable } from '@nestjs/common'
import { AddEmailInput } from '../../dto/addEmail.input'

@Injectable()
export class UserEmailsService {
  constructor(
    private readonly v2EmailsApi: V2MeEmailsApi,
    private readonly v2MeApi: V2MeApi,
    private readonly v2ActorApi: V2ActorApi,
  ) {}

  v2EmailsApiWithAuth(auth: Auth) {
    return this.v2EmailsApi.withMiddleware(new AuthMiddleware(auth))
  }

  v2MeApiWithAuth(auth: Auth) {
    return this.v2MeApi.withMiddleware(new AuthMiddleware(auth))
  }

  v2ActorApiWithAuth(auth: Auth) {
    return this.v2ActorApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getEmails(user: User): Promise<EmailsDto[]> {
    return this.v2EmailsApiWithAuth(user).emailsControllerFindAllByNationalId()
  }

  async addEmail({ user, input }: { user: User; input: AddEmailInput }) {
    return this.v2EmailsApiWithAuth(user).emailsControllerCreateEmail({
      createEmailDto: input,
    })
  }

  async setPrimaryEmail({
    emailId,
    user,
  }: {
    emailId: string
    user: User
  }): Promise<boolean> {
    await this.v2MeApiWithAuth(user).meUserProfileControllerSetEmailAsPrimary({
      emailId,
    })

    return true
  }

  async setActorProfileEmail({
    emailId,
    user,
  }: {
    emailId: string
    user: User
  }): Promise<boolean> {
    await this.v2ActorApiWithAuth(
      user,
    ).actorUserProfileControllerSetActorProfileEmail({
      setActorProfileEmailDto: {
        emailsId: emailId,
      },
    })

    return true
  }

  async deleteEmail({ emailId, user }: { emailId: string; user: User }) {
    await this.v2EmailsApiWithAuth(user).emailsControllerDeleteEmail({
      emailId,
    })

    return true
  }
}
