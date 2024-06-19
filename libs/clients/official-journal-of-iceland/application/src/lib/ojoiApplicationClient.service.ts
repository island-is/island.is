import { Inject, Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
  GetCommentsRequest,
  PostCommentRequest,
  PostApplicationRequest,
  GetCaseCommentsResponse,
  GetPriceRequest,
  CasePriceResponse,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'official-journal-of-iceland-application-client-service'

@Injectable()
export class OfficialJournalOfIcelandApplicationClientService {
  constructor(
    private readonly ojoiApplicationApi: OfficialJournalOfIcelandApplicationApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getComments(
    params: GetCommentsRequest,
  ): Promise<GetCaseCommentsResponse> {
    return await this.ojoiApplicationApi.getComments(params)
  }

  async postComment(params: PostCommentRequest): Promise<void> {
    await this.ojoiApplicationApi.postComment(params)
  }

  async postApplication(params: PostApplicationRequest): Promise<boolean> {
    try {
      await this.ojoiApplicationApi.postApplication(params)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(false)
    }
  }

  async getPrice(params: GetPriceRequest): Promise<CasePriceResponse> {
    try {
      return await this.ojoiApplicationApi.getPrice(params)
    } catch (error) {
      this.logger.warn('Failed to get price', {
        error,
        category: LOG_CATEGORY,
      })
      return {
        price: 0,
      }
    }
  }
}
