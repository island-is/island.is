import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DefaultApi as DmrApi,
  JournalControllerAdvertsRequest,
  JournalControllerValidateRequest,
} from '../../gen/fetch/apis'
import { JournalAdvert, JournalAdvertsResponse } from '../../gen/fetch'

const BASE_PATH = 'http://localhost:3000/api/v1'

@Injectable()
export class DmrClientService {
  constructor(private readonly dmrApi: DmrApi) {}

  public async validateAdvert(
    auth: User,
    advert: JournalControllerValidateRequest,
  ) {
    // we need to manually call fetch here because the generated client is not running on xroad yet

    return await this.dmrApi
      .withMiddleware(new AuthMiddleware(auth))
      .journalControllerValidate(advert)
  }

  public async adverts(
    auth: User,
    input: JournalControllerAdvertsRequest,
  ): Promise<Array<JournalAdvert>> {
    // We need to manually call fetch here because the generated client is not running on xroad yet
    return await fetch(`${BASE_PATH}/adverts?search=${input.search}`).then(
      (res) => res.json() as Promise<Array<JournalAdvert>>,
    )

    // return await this.dmrApi
    //   .withMiddleware(new AuthMiddleware(auth))
    //   .journalControllerAdverts(input)
  }
}
