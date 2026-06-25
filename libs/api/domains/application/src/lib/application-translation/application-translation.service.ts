import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type {
  ApplicationTranslationGql,
  ApplicationTranslationStatus,
  TemplateIntrospectionGql,
  TranslationPublishGql,
} from './application-translation.model'

export const TRANSLATION_API_CONFIG = 'TRANSLATION_API_CONFIG'

export interface TranslationApiConfig {
  baseApiUrl: string
}

@Injectable()
export class ApplicationTranslationApiService {
  constructor(
    @Inject(TRANSLATION_API_CONFIG)
    private readonly config: TranslationApiConfig,
  ) {}

  private getUrl(path: string): string {
    return `${this.config.baseApiUrl}/admin/translations${path}`
  }

  private getAuthorizationHeader(user: User): string {
    const raw = user.authorization
    if (!raw) {
      throw new UnauthorizedException(
        'Missing authorization token for application translation API',
      )
    }
    const token = raw.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      throw new UnauthorizedException(
        'Invalid authorization token for application translation API',
      )
    }
    return `Bearer ${token}`
  }

  private async request<T>(
    user: User,
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = this.getUrl(path)
    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthorizationHeader(user),
        },
        ...options,
      })
    } catch (err) {
      const hint =
        this.config.baseApiUrl.includes('localhost') ||
        this.config.baseApiUrl.includes('127.0.0.1')
          ? ' Ensure application-system-api is running (dev default: http://localhost:3333).'
          : ''
      throw new ServiceUnavailableException(
        `Could not reach application system API at ${url}: ${
          err instanceof Error ? err.message : String(err)
        }.${hint}`,
      )
    }

    if (!response.ok) {
      let detail = ''
      try {
        const text = await response.text()
        if (text) {
          detail = text.slice(0, 800)
        }
      } catch {
        // ignore
      }
      const message = detail
        ? `Translation API error: ${response.status} ${response.statusText} — ${detail}`
        : `Translation API error: ${response.status} ${response.statusText}`

      switch (response.status) {
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

    return response.json() as Promise<T>
  }

  private namespacePath(namespace: string, suffix: string): string {
    // Dots are not encoded by encodeURIComponent; match application-system URL encoding.
    const encodedNamespace = encodeURIComponent(namespace).replace(/\./g, '%2E')
    return `/${encodedNamespace}${suffix}`
  }

  async getTranslationsByNamespace(
    user: User,
    namespace: string,
  ): Promise<ApplicationTranslationGql[]> {
    return this.request<ApplicationTranslationGql[]>(
      user,
      this.namespacePath(namespace, '/all'),
    )
  }

  async getTranslationStatus(
    user: User,
    namespace: string,
  ): Promise<ApplicationTranslationStatus> {
    return this.request<ApplicationTranslationStatus>(
      user,
      this.namespacePath(namespace, '/status'),
    )
  }

  async getAllNamespacesWithStatus(
    user: User,
  ): Promise<ApplicationTranslationStatus[]> {
    return this.request<ApplicationTranslationStatus[]>(user, '')
  }

  async updateTranslation(
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

  async bulkUpdateTranslations(
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

  async reviewTranslation(
    user: User,
    id: string,
  ): Promise<ApplicationTranslationGql> {
    return this.request<ApplicationTranslationGql>(user, `/${id}/review`, {
      method: 'POST',
    })
  }

  async listTemplates(user: User): Promise<
    Array<{
      typeId: string
      name: string
      slug: string
      translationNamespaces: string[]
    }>
  > {
    return this.request<
      Array<{
        typeId: string
        name: string
        slug: string
        translationNamespaces: string[]
      }>
    >(user, '/templates/list')
  }

  async introspectTemplate(
    user: User,
    typeId: string,
  ): Promise<TemplateIntrospectionGql> {
    return this.request<TemplateIntrospectionGql>(
      user,
      `/templates/${typeId}/introspect`,
    )
  }

  async loadRoleForm(
    user: User,
    typeId: string,
    stateKey: string,
    roleId: string,
  ): Promise<unknown> {
    const params = new URLSearchParams({
      stateKey,
      roleId,
    })
    return this.request<unknown>(
      user,
      `/templates/${encodeURIComponent(typeId)}/form?${params.toString()}`,
    )
  }

  async listSharedNamespaces(user: User): Promise<
    Array<{
      namespace: string
      usedByCount: number
      usedByTypeIds: string[]
    }>
  > {
    return this.request<
      Array<{
        namespace: string
        usedByCount: number
        usedByTypeIds: string[]
      }>
    >(user, '/shared/list')
  }

  async introspectSharedNamespace(
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
    return this.request<{
      namespace: string
      messageDescriptors: Array<{
        id: string
        defaultMessage?: string
        description?: string
      }>
    }>(user, `/shared/introspect?${params.toString()}`)
  }

  async publishTranslations(
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

  async getPublishHistory(
    user: User,
    namespace: string,
  ): Promise<TranslationPublishGql[]> {
    return this.request<TranslationPublishGql[]>(
      user,
      this.namespacePath(namespace, '/publish-history'),
    )
  }

  async rollbackTranslations(
    user: User,
    namespace: string,
    publishId: string,
  ): Promise<TranslationPublishGql> {
    return this.request<TranslationPublishGql>(
      user,
      `${this.namespacePath(namespace, '/rollback')}/${encodeURIComponent(publishId)}`,
      {
        method: 'POST',
      },
    )
  }
}
