import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationTypeSettings,
  ContentfulRepository,
  getApplicationTypeSettingsQueryParams,
  getLocalApplicationTypeSettingsOverride,
  mapApplicationTypeSettings,
  sortApplicationTypeSettings,
} from '@island.is/cms'
import { ApplicationTypeBlocked } from '@island.is/nest/problem'
import { Locale } from '@island.is/shared/types'

type ApplicationTypeSettingsEntry = Parameters<
  typeof mapApplicationTypeSettings
>[0]

export const PREREQUISITES_STATE = 'prerequisites'

export const SETTINGS_CACHE_TTL_MS = 60 * 1000
export const SETTINGS_FAILURE_CACHE_TTL_MS = 10 * 1000
export const SETTINGS_REQUEST_TIMEOUT_MS = 2 * 1000

export interface LeavingPrerequisitesBlock {
  blockedTitle: string | null
  blockedMessage: string | null
}

interface CacheEntry {
  expiresAt: number
  settings: Promise<ApplicationTypeSettings[]>
}

/**
 * Reads per application type settings from Contentful so editors can stop users from
 * leaving the prerequisites state of a broken application type.
 * Fails open: if Contentful can not be reached nothing is blocked.
 */
@Injectable()
export class ApplicationTypeSettingsService {
  private readonly cache = new Map<string, CacheEntry>()

  constructor(
    private readonly contentfulRepository: ContentfulRepository,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async assertCanLeaveState(
    application: { id: string; typeId: string; state: string },
    locale: Locale,
  ): Promise<void> {
    if (application.state !== PREREQUISITES_STATE) {
      return
    }

    const block = await this.getLeavingPrerequisitesBlock(
      application.typeId,
      locale,
    )

    if (block) {
      this.logger.warn(
        'Blocked application from leaving prerequisites since its application type is blocked in the CMS',
        { applicationId: application.id, typeId: application.typeId },
      )
      throw new ApplicationTypeBlocked(application.typeId, block)
    }
  }

  async getLeavingPrerequisitesBlock(
    applicationType: string,
    locale: Locale,
  ): Promise<LeavingPrerequisitesBlock | null> {
    const settings = await this.getSettings(applicationType, locale)
    const blocking = settings.filter((s) => s.disableLeavingPrerequisites)

    if (blocking.length === 0) {
      return null
    }

    // Settings are sorted global first, so the type specific message wins
    const byPriority = [...blocking].reverse()
    return {
      blockedTitle:
        byPriority.find((s) => s.blockedTitle)?.blockedTitle ?? null,
      blockedMessage:
        byPriority.find((s) => s.blockedMessage)?.blockedMessage ?? null,
    }
  }

  private getSettings(
    applicationType: string,
    locale: Locale,
  ): Promise<ApplicationTypeSettings[]> {
    const localOverride =
      getLocalApplicationTypeSettingsOverride(applicationType)
    if (localOverride) {
      return Promise.resolve(localOverride)
    }

    const key = `${applicationType}:${locale}`
    const cached = this.cache.get(key)

    if (cached && cached.expiresAt > Date.now()) {
      return cached.settings
    }

    const settings = this.fetchSettings(applicationType, locale).catch(
      (error) => {
        this.logger.warn(
          'Failed to fetch application type settings from Contentful, not blocking',
          { applicationType, error },
        )
        this.cache.set(key, {
          expiresAt: Date.now() + SETTINGS_FAILURE_CACHE_TTL_MS,
          settings: Promise.resolve([]),
        })
        return []
      },
    )

    this.cache.set(key, {
      expiresAt: Date.now() + SETTINGS_CACHE_TTL_MS,
      settings,
    })

    return settings
  }

  private async fetchSettings(
    applicationType: string,
    locale: Locale,
  ): Promise<ApplicationTypeSettings[]> {
    let timeout: NodeJS.Timeout | undefined

    try {
      const result = await Promise.race([
        this.contentfulRepository.getLocalizedEntries<
          ApplicationTypeSettingsEntry['fields']
        >(locale, getApplicationTypeSettingsQueryParams(applicationType), 1),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () =>
              reject(
                new Error(
                  `Timed out after ${SETTINGS_REQUEST_TIMEOUT_MS}ms fetching application type settings`,
                ),
              ),
            SETTINGS_REQUEST_TIMEOUT_MS,
          )
        }),
      ])

      return sortApplicationTypeSettings(
        (result.items as ApplicationTypeSettingsEntry[]).map(
          mapApplicationTypeSettings,
        ),
      )
    } finally {
      clearTimeout(timeout)
    }
  }
}
