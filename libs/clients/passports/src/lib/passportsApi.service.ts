import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable, Inject } from '@nestjs/common'
import { IdentityDocumentApi } from '../../gen/fetch'
import { IdentityDocument } from './passportsApi.types'
import { mapPassports } from './passportsApi.utils'

@Injectable()
export class PassportsService {
  constructor(private passportApi: IdentityDocumentApi) {}

  async getPassports(user: User): Promise<IdentityDocument[]> {
    const identityDocuments = await this.passportApi
      .withMiddleware(new AuthMiddleware(user))
      .identityDocumentGetIdentityDocument({ personId: user.nationalId })
    return identityDocuments.map(mapPassports)
  }
}
