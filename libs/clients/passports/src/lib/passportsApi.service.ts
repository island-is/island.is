import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { XRoadConfig, ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { IdentityDocumentApi, PreregistrationApi } from '../../gen/fetch'
import {
  IdentityDocument,
  IdentityDocumentChild,
  PreregistrationInput,
} from './passportsApi.types'
import { mapChildPassports, mapPassports } from './passportsApi.utils'

@Injectable()
export class PassportsService {
  constructor(
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    private identityDocumentApi: IdentityDocumentApi,
    private preregistrationApi: PreregistrationApi,
  ) {}

  async getPassports(user: User): Promise<IdentityDocument[]> {
    const identityDocuments = await this.identityDocumentApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
    return identityDocuments.map(mapPassports)
  }

  async getChildPassports(user: User): Promise<IdentityDocumentChild[]> {
    const identityDocuments = await this.identityDocumentApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetChildrenIdentityDocument({
        xRoadClient: this.xroadConfig.xRoadClient,
      })
    return identityDocuments.map(mapChildPassports)
  }

  async preregisterIdentityDocument(
    user: User,
    input: PreregistrationInput,
  ): Promise<string[]> {
    return await this.preregistrationApi
      .withMiddleware(new AuthMiddleware(user))
      .preregistrationPreregistration({
        xRoadClient: this.xroadConfig.xRoadClient,
        preregistration: input,
      })
  }
}
