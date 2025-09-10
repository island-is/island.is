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

@Injectable()
export class HistoryBuilder {
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
      const { entryTimestamp, stateKey, exitEvent, exitEventSubjectNationalId, exitEventActorNationalId } = entry

      if (!exitEvent) continue

      const historyLog = templateHelper.getHistoryLog(stateKey, exitEvent)

      if (historyLog) {
        if (typeof historyLog.logMessage === 'function') {
          const values = { subject: exitEventSubjectNationalId, action: exitEventActorNationalId }
          const messageId = historyLog.logMessage(values)

          result.push(
            new HistoryResponseDto(
              entryTimestamp,
              messageId,
              formatMessage,
              values,
            )
          )
        } else {
        result.push(new HistoryResponseDto(entryTimestamp, historyLog.logMessage, formatMessage))
        }
      }
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }
}
