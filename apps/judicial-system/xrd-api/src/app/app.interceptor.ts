import fetch from 'isomorphic-fetch'
import { catchError, Observable } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'

import { Case } from './models/case.model'
import appModuleConfig from './app.config'

const reportError = (
  url: string,
  title: { title: string; emoji: string },
  info?: string,
  error?: unknown,
) => {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${title.emoji} *${title.title}*\n${info}${
              error ? `\n>${JSON.stringify(error)}` : ''
            }`,
          },
        },
      ],
    }),
  })
}

@Injectable()
export class EventInterceptor implements NestInterceptor {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const dto = context.switchToHttp().getRequest().body

    try {
      this.logger.info('Creating a case', {
        type: dto.type,
        policeCaseNumber: dto.policeCaseNumber,
        prosecutorNationalId: dto.prosecutorNationalId,
        leadInvestigator: dto.leadInvestigator,
        isHeightenedSecurityLevel: dto.isHeightenedSecurityLevel,
      })
    } catch (error) {
      this.logger.error('Failed to parse request body', { error })
    }

    return next.handle().pipe(
      catchError((error) => {
        reportError(
          this.config.errorReportUrl,
          {
            title: 'Ekki tókst að stofna mál í gegnum Strauminn',
            emoji: ':broken_heart:',
          },
          `${capitalize(formatCaseType(dto.type as CaseType))}: ${
            dto.policeCaseNumber
          }`,
          error,
        )

        throw error
      }),
    )
  }
}
