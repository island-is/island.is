import {
  ApplicationContext,
  ApplicationStateSchema,
  FormatMessage,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { EventObject } from 'xstate'
import { HistoryResponseDto } from './dto/history.dto'
import { History } from './history.model'
import { ApplicationTemplateHelper } from '@island.is/application/core'
import { IdentityClientService } from '@island.is/clients/identity'

@Injectable()
export class HistoryBuilder {
  constructor(private identityService: IdentityClientService) {}
  async buildApplicationHistory<
    TContext extends ApplicationContext,
    TStateSchema extends ApplicationStateSchema<TEvents>,
    TEvents extends EventObject,
  >(
    history: History[],
    formatMessage: FormatMessage,
    templateHelper: ApplicationTemplateHelper<TContext, TStateSchema, TEvents>,
  ): Promise<HistoryResponseDto[] | []> {
    const result = []

    for (const entry of history) {
      const {
        entryTimestamp,
        stateKey,
        exitEvent,
        exitEventSubjectNationalId,
        exitEventActorNationalId,
      } = entry

      if (!exitEvent) continue

      const historyLog = templateHelper.getHistoryLog(stateKey, exitEvent)

      if (historyLog) {
        if (typeof historyLog.logMessage === 'function') {
          const [subject, actor] = await Promise.all([
            exitEventSubjectNationalId
              ? this.identityService.tryToGetNameFromNationalId(
                  exitEventSubjectNationalId,
                )
              : Promise.resolve(undefined),

            exitEventActorNationalId
              ? this.identityService.tryToGetNameFromNationalId(
                  exitEventActorNationalId,
                )
              : Promise.resolve(undefined),
          ])

          const values = { subject, actor }

          const message = historyLog.logMessage(values)

          result.push(
            new HistoryResponseDto(
              entryTimestamp,
              message,
              formatMessage,
              values,
            ),
          )
        } else {
          result.push(
            new HistoryResponseDto(
              entryTimestamp,
              historyLog.logMessage,
              formatMessage,
            ),
          )
        }
      }
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }
}
