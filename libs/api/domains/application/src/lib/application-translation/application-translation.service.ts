import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type {
  ApplicationTranslationGql,
  ApplicationTranslationStatus,
  TemplateIntrospectionGql,
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
      throw new Error(
        'Missing authorization token for application translation API',
      )
    }
    const token = raw.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      throw new Error(
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
      throw new Error(
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
          detail = ` — ${text.slice(0, 800)}`
        }
      } catch {
        // ignore
      }
      throw new Error(
        `Translation API error: ${response.status} ${response.statusText}${detail}`,
      )
    }

    return response.json() as Promise<T>
  }

  async getTranslationsByNamespace(
    user: User,
    namespace: string,
  ): Promise<ApplicationTranslationGql[]> {
    return this.request<ApplicationTranslationGql[]>(user, `/${namespace}/all`)
  }

  async getTranslationStatus(
    user: User,
    namespace: string,
  ): Promise<ApplicationTranslationStatus> {
    return this.request<ApplicationTranslationStatus>(user, `/${namespace}/status`)
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

  async aiTranslateStrings(
    user: User,
    input: {
      namespace: string
      messageKeys: string[]
      sourceLocale: string
      targetLocale: string
    },
  ): Promise<{ translations: Record<string, string> }> {
    return this.request<{ translations: Record<string, string> }>(
      user,
      '/ai-translate',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    )
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
}
