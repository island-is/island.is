import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import type { User } from '@island.is/auth-nest-tools'
import {
  FetchError,
  type EnhancedFetchAPI,
  type EnhancedRequestInit,
} from '@island.is/clients/middlewares'

import { ApplicationTranslationConfig } from './application-translation.config'
import { APPLICATION_TRANSLATION_FETCH } from './application-translation.fetch'
import type {
  ApplicationTranslationGql,
  ApplicationTranslationStatus,
  TemplateIntrospectionGql,
  TranslationPublishGql,
} from './application-translation.model'

@Injectable()
export class ApplicationTranslationClient {
  constructor(
    @Inject(ApplicationTranslationConfig.KEY)
    private readonly config: ConfigType<typeof ApplicationTranslationConfig>,
    @Inject(APPLICATION_TRANSLATION_FETCH)
    private readonly fetch: EnhancedFetchAPI,
  ) {}

  private getUrl(path: string): string {
    const base = this.config.baseApiUrl.replace(/\/$/, '')
    return `${base}/admin/translations${path}`
  }

  private assertAuth(user: User): void {
    const raw = user.authorization
    if (!raw?.replace(/^Bearer\s+/i, '').trim()) {
      throw new UnauthorizedException(
        'Missing authorization token for application translation API',
      )
    }
  }

  private formatErrorDetail(error: FetchError): string {
    if (typeof error.body === 'string') {
      return error.body.slice(0, 800)
    }
    if (error.body) {
      return JSON.stringify(error.body).slice(0, 800)
    }
    return ''
  }

  private handleError(error: unknown, url: string): never {
    if (error instanceof FetchError) {
      const detail = this.formatErrorDetail(error)
      const message = detail
        ? `Translation API error: ${error.status} ${error.statusText} — ${detail}`
        : `Translation API error: ${error.status} ${error.statusText}`

      switch (error.status) {
        case 401:
          throw new UnauthorizedException(message)
        case 403:
          throw new ForbiddenException(message)
        case 404:
          throw new NotFoundException(message)
        case 503:
          throw new ServiceUnavailableException(message)
        default:
          throw new InternalServerErrorException(message)
      }
    }

    const hint =
      this.config.baseApiUrl.includes('localhost') ||
      this.config.baseApiUrl.includes('127.0.0.1')
        ? ' Ensure application-system-api is running (dev default: http://localhost:3333).'
        : ''

    throw new ServiceUnavailableException(
      `Could not reach application system API at ${url}: ${
        error instanceof Error ? error.message : String(error)
      }.${hint}`,
    )
  }

  private async request<T>(
    user: User,
    path: string,
    init?: EnhancedRequestInit,
  ): Promise<T> {
    this.assertAuth(user)
    const url = this.getUrl(path)

    try {
      const response = await this.fetch(url, {
        ...init,
        auth: user,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
      return response.json() as Promise<T>
    } catch (error) {
      this.handleError(error, url)
    }
  }

  private namespacePath(namespace: string, suffix: string): string {
    // Dots are not encoded by encodeURIComponent; match application-system URL encoding.
    const encodedNamespace = encodeURIComponent(namespace).replace(/\./g, '%2E')
    return `/${encodedNamespace}${suffix}`
  }

  getTranslationsByNamespace(
    user: User,
    namespace: string,
  ): Promise<ApplicationTranslationGql[]> {
    return this.request<ApplicationTranslationGql[]>(
      user,
      this.namespacePath(namespace, '/all'),
    )
  }

  getTranslationStatus(
    user: User,
    namespace: string,
  ): Promise<ApplicationTranslationStatus> {
    return this.request<ApplicationTranslationStatus>(
      user,
      this.namespacePath(namespace, '/status'),
    )
  }

  getAllNamespacesWithStatus(
    user: User,
  ): Promise<ApplicationTranslationStatus[]> {
    return this.request<ApplicationTranslationStatus[]>(user, '')
  }

  updateTranslation(
    user: User,
    input: {
      namespace: string
      messageKey: string
      valueIs?: string
      valueEn?: string
    },
  ): Promise<ApplicationTranslationGql> {
    return this.request<ApplicationTranslationGql>(user, '', {
      method: 'PUT',
      body: JSON.stringify(input),
    })
  }

  bulkUpdateTranslations(
    user: User,
    translations: Array<{
      namespace: string
      messageKey: string
      valueIs?: string
      valueEn?: string
    }>,
  ): Promise<ApplicationTranslationGql[]> {
    return this.request<ApplicationTranslationGql[]>(user, '/bulk', {
      method: 'POST',
      body: JSON.stringify({ translations }),
    })
  }

  reviewTranslation(
    user: User,
    id: string,
  ): Promise<ApplicationTranslationGql> {
    return this.request<ApplicationTranslationGql>(user, `/${id}/review`, {
      method: 'POST',
    })
  }

  listTemplates(user: User): Promise<
    Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }>
  > {
    return this.request(user, '/templates/list')
  }

  introspectTemplate(
    user: User,
    typeId: string,
  ): Promise<TemplateIntrospectionGql> {
    return this.request<TemplateIntrospectionGql>(
      user,
      `/templates/${typeId}/introspect`,
    )
  }

  loadRoleForm(
    user: User,
    typeId: string,
    stateKey: string,
    roleId: string,
  ): Promise<unknown> {
    const params = new URLSearchParams({ stateKey, roleId })
    return this.request<unknown>(
      user,
      `/templates/${encodeURIComponent(typeId)}/form?${params.toString()}`,
    )
  }

  listSharedNamespaces(user: User): Promise<
    Array<{
      namespace: string
      usedByCount: number
      usedByTypeIds: string[]
    }>
  > {
    return this.request(user, '/shared/list')
  }

  introspectSharedNamespace(
    user: User,
    namespace: string,
  ): Promise<{
    namespace: string
    messageDescriptors: Array<{
      id: string
      defaultMessage?: string
      description?: string
    }>
  }> {
    const params = new URLSearchParams({ namespace })
    return this.request(user, `/shared/introspect?${params.toString()}`)
  }

  publishTranslations(
    user: User,
    namespace: string,
    note?: string,
  ): Promise<TranslationPublishGql> {
    return this.request<TranslationPublishGql>(
      user,
      this.namespacePath(namespace, '/publish'),
      {
        method: 'POST',
        body: JSON.stringify({ note }),
      },
    )
  }

  getPublishHistory(
    user: User,
    namespace: string,
  ): Promise<TranslationPublishGql[]> {
    return this.request<TranslationPublishGql[]>(
      user,
      this.namespacePath(namespace, '/publish-history'),
    )
  }

  rollbackTranslations(
    user: User,
    namespace: string,
    publishId: string,
  ): Promise<TranslationPublishGql> {
    return this.request<TranslationPublishGql>(
      user,
      `${this.namespacePath(namespace, '/rollback')}/${encodeURIComponent(
        publishId,
      )}`,
      {
        method: 'POST',
      },
    )
  }
}
