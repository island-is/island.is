import { Inject, Injectable } from '@nestjs/common'
import { freshdeskApi } from '@island.is/clients/freshdesk'
import { Category, Search } from './graphql'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class FreshdeskService {
  constructor(
    private readonly freshdeskApi: freshdeskApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getCategories(): Promise<Category[]> {
    let response

    try {
      response = await this.freshdeskApi.getCategories()
    } catch ({ message }) {
      const errMsg = 'Freshdesk: Failed to get Freshdesk categories'

      this.logger.error(errMsg, {
        message,
      })

      throw new Error(errMsg)
    }

    return response
  }

  async search(term: string): Promise<Search[]> {
    let response

    try {
      response = await this.freshdeskApi.search(term)
    } catch ({ message }) {
      const errMsg = 'Freshdesk: Failed to search'

      this.logger.error(errMsg, {
        message,
      })

      throw new Error(errMsg)
    }

    return response
  }
}
