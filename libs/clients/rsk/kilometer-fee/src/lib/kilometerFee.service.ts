import { Injectable } from '@nestjs/common'

import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'

import {
  getKilometerFee,
  getKilometerFeeExport,
  KilometerFee,
} from '../../gen/fetch'

@Injectable()
export class RskKilometerFeeClientService {
  getFee = (
    user: User,
    permno: string,
    year: number,
  ): Promise<KilometerFee | null> =>
    withAuthContext(user, () =>
      dataOr404Null(getKilometerFee({ path: { permno }, query: { year } })),
    )

  getFeeExport = (
    user: User,
    permno: string,
    year: number,
  ): Promise<Blob | null> =>
    withAuthContext(user, () =>
      dataOr404Null(
        getKilometerFeeExport({
          path: { permno },
          query: { year },
          headers: {
            Accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        }),
      ),
    )
}
