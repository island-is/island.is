import { Inject, Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
  GetCommentsRequest,
  PostCommentRequest,
  PostApplicationRequest,
  GetCaseCommentsResponse,
  GetPriceRequest,
  CasePriceResponse,
  GetPdfUrlResponse,
  GetPdfUrlByApplicationIdRequest,
  GetPdfByApplicationIdRequest,
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

  async getPdfUrl(
    params: GetPdfUrlByApplicationIdRequest,
  ): Promise<GetPdfUrlResponse> {
    return await this.ojoiApplicationApi.getPdfUrlByApplicationId(params)
  }

  async getPdf(params: GetPdfByApplicationIdRequest): Promise<Buffer> {
    const streamableFile = await this.ojoiApplicationApi.getPdfByApplicationId(
      params,
    )

    const isStreamable = (
      streamableFile: any,
    ): streamableFile is { getStream: () => NodeJS.ReadableStream } =>
      typeof streamableFile.getStream === 'function'

    if (!isStreamable(streamableFile)) {
      throw new Error('Error reading streamable file')
    }

    const chunks: Uint8Array[] = [] // Change the type of 'chunks' to 'Uint8Array[]'
    for await (const chunk of streamableFile.getStream()) {
      if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk))
      } else {
        chunks.push(chunk)
      }
    }

    return Buffer.concat(chunks)
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
