import { Injectable } from '@nestjs/common'
import { Auth, withAuthContext } from '@island.is/auth-nest-tools'
import {
  PermitHunting,
  permitHunting,
  PermitRanger,
  permitRanger,
} from '../../gen/fetch'
import { CodeOwners } from '@island.is/shared/constants'
import { CodeOwner } from '@island.is/nest/core'
import { dataOr404Null } from '@island.is/clients/middlewares'

@Injectable()
@CodeOwner(CodeOwners.Hugsmidjan)
export class NvsPermitsClientService {
  public async getHuntingPermits(auth: Auth): Promise<PermitHunting | null> {
    return dataOr404Null(
      withAuthContext(auth, () => {
        return permitHunting({
          headers: {
            'X-Query-National-Id': auth.nationalId ?? '',
          },
        })
      }),
    )
  }

  public async getRangerPermits(auth: Auth): Promise<PermitRanger | null> {
    return dataOr404Null(
      withAuthContext(auth, () => {
        return permitRanger({
          headers: {
            'X-Query-National-Id': auth.nationalId ?? '',
          },
        })
      }),
    )
  }
}
