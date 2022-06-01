import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../..'
import { TemplateApiModuleActionProps } from '../../../../types'
@Injectable()
export class UserProfileService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly userProfileApi: UserProfileApi,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfile({ auth }: TemplateApiModuleActionProps) {
    const profile = await this.userProfileApiWithAuth(
      auth,
    ).userProfileControllerFindOneByNationalId({
      nationalId: auth.nationalId,
    })

    return {
      email: profile.email,
      emailVerified: profile.emailVerified,
      mobilePhoneNumber: profile.mobilePhoneNumber,
      mobilePhoneNumberVerified: profile.mobilePhoneNumberVerified,
    }
  }
}
