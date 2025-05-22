import { Inject, Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
  GetCommentsRequest,
  PostCommentRequest,
  PostApplicationRequest,
  GetPriceRequest,
  CasePriceResponse,
  GetPdfUrlResponse,
  GetPdfUrlByApplicationIdRequest,
  GetPdfByApplicationIdRequest,
  GetPresignedUrlRequest,
  PresignedUrlResponse,
  AddApplicationAttachmentRequest,
  GetApplicationAttachmentsRequest,
  DeleteApplicationAttachmentRequest,
  GetInvolvedPartiesRequest,
  GetApplicationCaseRequest,
  GetApplicationCaseResponse,
  GetPdfRespone,
  GetSignaturesForInvolvedPartyRequest,
  GetApplicationAdvertTemplateRequest,
  GetComments,
  GetSignature,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { AdvertTemplateType } from './dtos/advertTemplateTypes.dto'
import { mapTemplateEnumToLiteral } from './utils'
import { AdvertTemplate } from './dtos/advertTemplate.dto'

const LOG_CATEGORY = 'official-journal-of-iceland-application-client-service'

@Injectable()
export class OfficialJournalOfIcelandApplicationClientService {
  constructor(
    private readonly ojoiApplicationApi: OfficialJournalOfIcelandApplicationApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private ojoiApplicationApiWithAuth(auth: Auth) {
    return this.ojoiApplicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getComments(
    params: GetCommentsRequest,
    auth: Auth,
  ): Promise<GetComments> {
    try {
      return await this.ojoiApplicationApiWithAuth(auth).getComments(params)
    } catch (error) {
      this.logger.warn('Failed to get comments', {
        error,
        applicationId: params.id,
        category: LOG_CATEGORY,
      })

      throw error
    }
  }

  async postComment(params: PostCommentRequest, auth: Auth): Promise<boolean> {
    try {
      await this.ojoiApplicationApiWithAuth(auth).postComment(params)
      return true
    } catch (error) {
      this.logger.warn(`Failed to post comment: ${error.message}`, {
        error,
        applicationId: params.id,
        category: LOG_CATEGORY,
      })
      return false
    }
  }

  async postApplication(
    params: PostApplicationRequest,
    auth: Auth,
  ): Promise<boolean> {
    try {
      await this.ojoiApplicationApiWithAuth(auth).postApplication(params)
      return Promise.resolve(true)
    } catch (error) {
      this.logger.warn('Failed to post application', {
        error,
        applicationId: params.id,
        category: LOG_CATEGORY,
      })
      return Promise.reject(false)
    }
  }

  async getPdfUrl(
    params: GetPdfUrlByApplicationIdRequest,
    auth: Auth,
  ): Promise<GetPdfUrlResponse> {
    return await this.ojoiApplicationApiWithAuth(auth).getPdfUrlByApplicationId(
      params,
    )
  }

  async getPdf(
    params: GetPdfByApplicationIdRequest,
    auth: Auth,
  ): Promise<GetPdfRespone> {
    try {
      return this.ojoiApplicationApiWithAuth(auth).getPdfByApplicationId(params)
    } catch (error) {
      this.logger.warn('Failed to get pdf', {
        applicationId: params.id,
        error,
        category: LOG_CATEGORY,
      })

      throw error
    }
  }

  async getPrice(
    params: GetPriceRequest,
    auth: Auth,
  ): Promise<CasePriceResponse> {
    try {
      return await this.ojoiApplicationApiWithAuth(auth).getPrice(params)
    } catch (error) {
      this.logger.warn('Failed to get price', {
        applicationId: params.id,
        error,
        category: LOG_CATEGORY,
      })
      return {
        price: 0,
      }
    }
  }
  async getPresignedUrl(
    params: GetPresignedUrlRequest,
    auth: Auth,
  ): Promise<PresignedUrlResponse> {
    return await this.ojoiApplicationApiWithAuth(auth).getPresignedUrl(params)
  }

  async addApplicationAttachment(
    params: AddApplicationAttachmentRequest,
    auth: Auth,
  ): Promise<void> {
    try {
      await this.ojoiApplicationApiWithAuth(auth).addApplicationAttachment(
        params,
      )
    } catch (error) {
      this.logger.warn('Failed to add application attachment', {
        category: LOG_CATEGORY,
        applicationId: params.id,
      })
      throw error
    }
  }

  async getApplicationAttachments(
    params: GetApplicationAttachmentsRequest,
    auth: Auth,
  ) {
    return this.ojoiApplicationApiWithAuth(auth).getApplicationAttachments(
      params,
    )
  }

  async deleteApplicationAttachment(
    params: DeleteApplicationAttachmentRequest,
    auth: Auth,
  ) {
    await this.ojoiApplicationApiWithAuth(auth).deleteApplicationAttachment(
      params,
    )
  }

  getApplicationAdvertTemplate = async (
    params: GetApplicationAdvertTemplateRequest,
    auth: Auth,
  ): Promise<AdvertTemplate> => {
    const template = await this.ojoiApplicationApiWithAuth(
      auth,
    ).getApplicationAdvertTemplate(params)

    return {
      type: mapTemplateEnumToLiteral(template.type),
      html: template.html,
    }
  }

  getApplicationAdvertTemplateTypes = async (
    auth: Auth,
  ): Promise<AdvertTemplateType[]> => {
    const advertTemplates = await this.ojoiApplicationApiWithAuth(
      auth,
    ).getApplicationAdvertTemplates()

    return advertTemplates.map((template) => ({
      type: mapTemplateEnumToLiteral(template.slug),
      title: template.title,
    }))
  }

  async getUserInvolvedParties(params: GetInvolvedPartiesRequest, auth: Auth) {
    try {
      const data = await this.ojoiApplicationApiWithAuth(
        auth,
      ).getInvolvedParties(params)
      return data
    } catch (error) {
      this.logger.warn('Failed to get involved parties', {
        error,
        applicationId: params.id,
        category: LOG_CATEGORY,
      })

      throw error
    }
  }

  async getMyUserInfo(auth: Auth) {
    try {
      const data = await this.ojoiApplicationApiWithAuth(auth).getMyUserInfo()
      return data
    } catch (error) {
      this.logger.warn('Failed to get my user info', {
        error,
        category: LOG_CATEGORY,
      })
      throw error
    }
  }

  async getApplicationCase(
    params: GetApplicationCaseRequest,
    auth: Auth,
  ): Promise<GetApplicationCaseResponse> {
    try {
      return await this.ojoiApplicationApiWithAuth(auth).getApplicationCase(
        params,
      )
    } catch (error) {
      this.logger.warn('Failed to get application case', {
        error,
        applicationId: params.id,
        category: LOG_CATEGORY,
      })

      throw error
    }
  }

  async getSignaturesForInvolvedParty(
    params: GetSignaturesForInvolvedPartyRequest,
    auth: Auth,
  ): Promise<GetSignature> {
    try {
      return await this.ojoiApplicationApiWithAuth(
        auth,
      ).getSignaturesForInvolvedParty(params)
    } catch (error) {
      this.logger.warn('Failed to get involved party signatures', {
        error,
        category: LOG_CATEGORY,
      })

      throw error
    }
  }
}
