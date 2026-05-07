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

  public async getMeals(selectedDate?: string): Promise<OpenMealMenuResponse> {
    const parsedSelectedDate = selectedDate ? new Date(selectedDate) : undefined
    const hasValidSelectedDate =
      parsedSelectedDate && !Number.isNaN(parsedSelectedDate.getTime())

    const { data, error } = await openMealGetAllMeals({
      query: {
        distributorId: this.config.distributorId,
        lang: 'is',
        ...(hasValidSelectedDate
          ? {
              startDate: parsedSelectedDate,
              endDate: parsedSelectedDate,
            }
          : {}),
      },
    })

    if (error) {
      throw error
    }

    return data ?? { meals: [] }
  }
}
