import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AxiosRequestConfig } from 'axios'
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

      this.logger.error(errMsg, {
        message: description,
      })

      return null
    }
  }

  async getDocumentList(
    nationalId?: string,
    input?: {
      senderKennitala?: string | null
      dateFrom?: string | null
      dateTo?: string | null
      categoryId?: string | null
      typeId?: string | null
      archived?: boolean | null
      sortBy?: 'Subject' | 'Sender' | 'Category' | 'Date' | 'Type' | null
      order?: 'Ascending' | 'Descending' | null
      subjectContains?: string | null
      opened?: boolean | null
      page?: number | null
      pageSize?: number | null
    },
  ): Promise<ListDocumentsResponse | null> {
    const requestRoute = `/api/mail/v1/customers/${nationalId}/messages?senderKennitala=${
      input?.senderKennitala ?? ''
    }&dateFrom=${input?.dateFrom ?? ''}&dateTo=${
      input?.dateTo ?? ''
    }&categoryId=${input?.categoryId ?? ''}&typeId=${
      input?.typeId ?? ''
    }&sortBy=${input?.sortBy ?? 'Date'}&order=${
      input?.order ?? 'Descending'
    }&subjectContains=${input?.subjectContains ?? ''}&opened=${
      input?.opened ?? ''
    }&page=${input?.page ?? 1}&pageSize=${input?.pageSize ?? 15}`

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
}
