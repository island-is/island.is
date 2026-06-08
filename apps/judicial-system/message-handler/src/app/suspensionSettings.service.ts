import fetch from 'node-fetch'

import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import type {
  Message,
  SuspensionDecision,
} from '@island.is/judicial-system/message'
import { getMessageSuspensionCategory } from '@island.is/judicial-system/message'
import { MessageSuspensionCategory } from '@island.is/judicial-system/types'

import { appModuleConfig } from './app.config'

interface MessageSuspensionSetting {
  category: MessageSuspensionCategory
  suspended: boolean
  delaySeconds: number
}

@Injectable()
export class SuspensionSettingsService
  implements OnModuleInit, OnModuleDestroy
{
  // Last known suspension settings, keyed by category. Empty until the first
  // successful refresh, which means we fail open (handle everything) on startup.
  private settings = new Map<
    MessageSuspensionCategory,
    MessageSuspensionSetting
  >()
  private timer?: NodeJS.Timeout

  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.refresh()

    this.timer = setInterval(
      () => this.refresh(),
      this.config.suspensionRefreshSeconds * 1000,
    )

    // Do not let the refresh timer keep the process (or tests) alive
    this.timer.unref?.()
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  private async refresh(): Promise<void> {
    try {
      const res = await fetch(
        `${this.config.backendUrl}/api/internal/message-suspension`,
        {
          method: 'GET',
          headers: {
            authorization: `Bearer ${this.config.backendAccessToken}`,
          },
        },
      )

      if (!res.ok) {
        throw await res.text()
      }

      const settings: MessageSuspensionSetting[] = await res.json()

      this.settings = new Map(
        settings.map((setting) => [setting.category, setting]),
      )
    } catch (reason) {
      // Fail open: keep serving the last known settings (none on startup) so a
      // backend outage never blocks message handling.
      this.logger.error('Failed to refresh message suspension settings', {
        reason,
      })
    }
  }

  shouldSuspend(message: Message): SuspensionDecision {
    const category = getMessageSuspensionCategory(message.type)

    if (!category) {
      return { suspend: false, delaySeconds: 0 }
    }

    const setting = this.settings.get(category)

    if (!setting?.suspended) {
      return { suspend: false, delaySeconds: 0 }
    }

    return { suspend: true, delaySeconds: setting.delaySeconds }
  }
}
