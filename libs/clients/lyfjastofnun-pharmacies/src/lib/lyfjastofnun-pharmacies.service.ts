import { Injectable } from '@nestjs/common'

import { Lyfjabud, getApiV1EftirlitLyfjabudir } from '../../gen/fetch'

@Injectable()
export class LyfjastofnunPharmaciesClientService {
  public getPharmacies = async (): Promise<Lyfjabud[]> => {
    const response = await getApiV1EftirlitLyfjabudir()

    return response.data ?? []
  }
}
