import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig, Method } from 'axios'
import {
  CategoriesResponse,
  DocumentDTO,
  CustomersDocumentRequest,
  ListDocumentsResponse,
  TypesResponse,
  SendersResponse,
} from './models'
import { DocumentOauthConnection } from './document.connection'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { lastValueFrom } from 'rxjs'
import { GetDocumentListInput } from './models/DocumentInput'
import { PaperMailResponse } from './models/PaperMailRes'
import { RequestPaperDTO } from './models/RequestPaperDTO'
import { MessageActionDTO } from './models/MessageActionDTO'
import { BulkMailActionDTO } from './models/BulkMailActionDTO'

export const DOCUMENT_CLIENT_CONFIG = 'DOCUMENT_CLIENT_CONFIG'

export interface DocumentClientConfig {
  basePath: string
  clientId: string
  clientSecret: string
  tokenUrl: string
}

@Injectable()
export class DocumentClient {
  private accessToken!: string
  private accessTokenExpiryDate!: Date

  constructor(
    private httpService: HttpService,
    @Inject(DOCUMENT_CLIENT_CONFIG)
    private clientConfig: DocumentClientConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private async rehydrateToken() {
    if (
      !this.accessTokenExpiryDate ||
      this.accessTokenExpiryDate < new Date()
    ) {
      const { token, expiresIn } = await DocumentOauthConnection.fetchToken(
        this.clientConfig,
      )
      this.accessToken = token
      const expiryTime = new Date()
      expiryTime.setSeconds(expiryTime.getSeconds() + expiresIn)
      this.accessTokenExpiryDate = expiryTime
    }
  }

  private async getRequest<T>(requestRoute: string): Promise<T | null> {
    await this.rehydrateToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }

    try {
      const response: {
        data: T
      } = await lastValueFrom(
        this.httpService.get(
          `${this.clientConfig.basePath}${requestRoute}`,
          config,
        ),
      )

      return response.data
    } catch (e) {
      const errMsg = 'Failed to get from Postholf'
      const error = e.toJSON()
      const description = error.message
      const message = [errMsg, description].filter(Boolean).join(' - ')
      throw new Error(message)
    }
  }

  private async postRequest<T>(requestRoute: string, body: any): Promise<T> {
    await this.rehydrateToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }

    try {
      const response: {
        data: T
      } = await lastValueFrom(
        this.httpService.post(
          `${this.clientConfig.basePath}${requestRoute}`,
          body,
          config,
        ),
      )

      return response.data
    } catch (e) {
      const errMsg = 'Failed to POST to Postholf'
      const error = e.toJSON()
      const description = error.message
      const message = [errMsg, description].filter(Boolean).join(' - ')
      throw new Error(message)
    }
  }

  async getDocumentList(
    nationalId: string,
    input?: GetDocumentListInput,
  ): Promise<ListDocumentsResponse | null> {
    const {
      senderKennitala,
      dateFrom,
      dateTo,
      categoryId,
      typeId,
      sortBy,
      order,
      subjectContains,
      opened,
      page,
      pageSize,
      archived,
      bookmarked,
    } = input ?? {}

    type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T

    const inputs = [
      sortBy ? `sortBy=${sortBy}` : 'sortBy=Date', // first in array to skip &
      order ? `orderBy=${order}` : 'order=Descending',
      page ? `page=${page}` : 'page=1',
      pageSize ? `pageSize=${pageSize}` : 'pageSize=15',
      senderKennitala && `senderKennitala=${senderKennitala}`,
      dateFrom && `dateFrom=${dateFrom}`,
      dateTo && `dateTo=${dateTo}`,
      categoryId && `categoryId=${categoryId}`,
      typeId && `typeId=${typeId}`,
      subjectContains && `subjectContains=${subjectContains}`,
      bookmarked && `bookmarked=${bookmarked}`,
      `opened=${opened}`,
      `archived=${archived}`,
    ].filter(Boolean as unknown as ExcludesFalse)

    const requestRoute = `/api/mail/v1/customers/${nationalId}/messages?${inputs.join(
      '&',
    )}`

    return await this.getRequest<ListDocumentsResponse>(encodeURI(requestRoute))
  }

  async customersDocument(
    requestParameters: CustomersDocumentRequest,
  ): Promise<DocumentDTO | null> {
    const { kennitala, messageId, authenticationType } = requestParameters
    const requestRoute = `/api/mail/v1/customers/${kennitala}/messages/${messageId}?authenticationType=${authenticationType}`
    return await this.getRequest<DocumentDTO>(requestRoute)
  }

  async customersCategories(
    nationalId: string,
  ): Promise<CategoriesResponse | null> {
    const requestRoute = `/api/mail/v1/customers/${nationalId}/messages/categories`
    return await this.getRequest<CategoriesResponse>(requestRoute)
  }

  async customersTypes(nationalId: string): Promise<TypesResponse | null> {
    const requestRoute = `/api/mail/v1/customers/${nationalId}/messages/types`
    return await this.getRequest<TypesResponse>(requestRoute)
  }

  async customersSenders(nationalId: string): Promise<SendersResponse | null> {
    const requestRoute = `/api/mail/v1/customers/${nationalId}/messages/senders`
    return await this.getRequest<SendersResponse>(requestRoute)
  }

  async requestPaperMail(
    nationalId: string,
  ): Promise<PaperMailResponse | null> {
    const requestRoute = `/api/mail/v1/customers/${nationalId}/paper`
    return await this.getRequest<PaperMailResponse>(requestRoute)
  }

  async postPaperMail(
    body: RequestPaperDTO,
  ): Promise<PaperMailResponse | null> {
    const requestRoute = `/api/mail/v1/customers/${body.kennitala}/paper`
    return await this.postRequest<PaperMailResponse>(requestRoute, body)
  }

  async postMailAction(
    body: MessageActionDTO,
    action: 'archive' | 'unarchive' | 'bookmark' | 'unbookmark',
  ): Promise<null> {
    const requestRoute = `/api/mail/v1/customers/${body.nationalId}/messages/${body.messageId}/${action}`
    return await this.postRequest(requestRoute, body)
  }

  async bulkMailAction(
    body: BulkMailActionDTO,
    nationalId: string,
  ): Promise<any | null> {
    const { action, ...postBody } = body
    const requestRoute = `/api/mail/v1/customers/${nationalId}/messages/batch${action}`
    return await this.postRequest(requestRoute, postBody)
  }
}
