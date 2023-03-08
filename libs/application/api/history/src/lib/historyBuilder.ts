import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
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
    TEvents extends EventObject
  >(
    history: History[],
    formatMessage: FormatMessage,
    templateHelper: ApplicationTemplateHelper<TContext, TStateSchema, TEvents>,
  ): Promise<HistoryResponseDto[] | []> {
    const result = []

    for (const entry of history) {
      const { entryTimestamp, exitTimestamp, stateKey } = entry

      const entryLogPromise = await templateHelper.getHistoryLog(
        'entry',
        stateKey,
      )

      const exitLogPromise = exitTimestamp
        ? await templateHelper.getHistoryLog('exit', stateKey)
        : undefined

      const [entryLog, exitLog] = await Promise.all([
        entryLogPromise,
        exitLogPromise,
      ])

      if (entryLog) {
        result.push(
          new HistoryResponseDto(entryTimestamp, entryLog, formatMessage),
        )
      }

      if (exitLog && exitTimestamp) {
        result.push(
          new HistoryResponseDto(exitTimestamp, exitLog, formatMessage),
        )
      }
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }
}
