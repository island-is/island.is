import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi as DmrApi,
  JournalControllerValidateRequest,
} from '../../gen/fetch/apis'

@Injectable()
export class DmrClientService {
  constructor(private readonly dmrApi: DmrApi) {}

  public async validateAdvert(
    auth: User,
    advert: JournalControllerValidateRequest,
  ) {
    console.log('from dmr client service:', advert)
    return await this.dmrApi
      .withMiddleware(new AuthMiddleware(auth))
      .journalControllerValidate(advert)
  }
}
