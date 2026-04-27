import { Injectable } from '@nestjs/common'

import { Lyfjabud, getApiV1EftirlitLyfjabudir } from '../../gen/fetch'

@Injectable()
export class LyfjastofnunPharmaciesClientService {
  public getPharmacies = async (): Promise<Lyfjabud[]> => {
    const { data, error } = await getApiV1EftirlitLyfjabudir()

    if (error) {
      throw error
    }

    return data ?? []
  }
}
