import {TemplateService} from '@island.is/application/api/core'
import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTypes,
  FormatMessage,
} from '@island.is/application/types'
import {Injectable} from '@nestjs/common'
import {EventObject} from 'xstate'
import {HistoryResponseDto} from './dto/history.dto'
import {History} from './history.model'

@Injectable()
export class HistoryBuilder<
  TContext extends ApplicationContext,
  TStateSchema extends ApplicationStateSchema<TEvents>,
  TEvents extends EventObject
> {
  constructor(
    private readonly templateService: TemplateService<
      TContext,
      TStateSchema,
      TEvents
    >,
  ) {
  }

  async buildApplicationHistory(
    applicationTypeId: ApplicationTypes,
    history: History[],
    formatMessage: FormatMessage,
  ): Promise<HistoryResponseDto[] | []> {
    const result = []

    for (const entry of history) {
      const {entryTimestamp, exitTimestamp, stateKey} = entry

      const entryLogPromise = this.templateService.getHistoryLog(
        'entry',
        stateKey,
        applicationTypeId,
      )

      const exitLogPromise = exitTimestamp
        ? this.templateService.getHistoryLog(
          'exit',
          stateKey,
          applicationTypeId,
        )
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
