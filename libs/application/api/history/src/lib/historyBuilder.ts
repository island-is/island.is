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
      const { entryTimestamp, stateKey, exitEvent } = entry

      if (!exitEvent) continue

      const entryLog = templateHelper.getHistoryLogs(stateKey, exitEvent)

      if (entryLog) {
        result.push(
          new HistoryResponseDto(entryTimestamp, entryLog, formatMessage),
        )
      }
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }
}
