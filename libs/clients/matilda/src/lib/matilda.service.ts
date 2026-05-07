import { Injectable, Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'

import { openMealGetAllMeals, type OpenMealMenuResponse } from '../../gen/fetch'
import { MatildaClientConfig } from './matilda.config'

@Injectable()
export class MatildaClientService {
  constructor(
    @Inject(MatildaClientConfig.KEY)
    private readonly config: ConfigType<typeof MatildaClientConfig>,
  ) {}

  public async getMeals(): Promise<OpenMealMenuResponse> {
    const { data, error } = await openMealGetAllMeals({
      query: {
        distributorId: this.config.distributorId,
        lang: 'is',
      },
    })

    if (error) {
      throw error
    }

    return data ?? { meals: [] }
  }
}
