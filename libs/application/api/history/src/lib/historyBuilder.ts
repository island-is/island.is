import {
  ApplicationContext,
  ApplicationStateSchema,
  FormatMessage,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { EventObject } from 'xstate'
import { HistoryResponseDto } from './dto/history.dto'
import { History } from './history.model'
import {
  ApplicationTemplateHelper,
  coreHistoryMessages,
} from '@island.is/application/core'
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
    applicantNationalId: string,
  ): Promise<HistoryResponseDto[] | []> {
    const result = []

    for (const entry of history) {
      const {
        entryTimestamp,
        stateKey,
        exitEvent,
        exitEventSubjectNationalId: subjectNationalId,
        exitEventActorNationalId: actorNationalId,
      } = entry

      if (!exitEvent) continue

      const historyLog = templateHelper.getHistoryLog(stateKey, exitEvent)

      if (historyLog) {
        let subjectAndActorText: string | undefined

        if (
          (subjectNationalId && subjectNationalId !== applicantNationalId) ||
          (actorNationalId && actorNationalId !== applicantNationalId)
        ) {
          const [subjectName, actorName] = await Promise.all([
            subjectNationalId
              ? this.identityService.tryToGetNameFromNationalId(
                  subjectNationalId,
                )
              : Promise.resolve(undefined),
            actorNationalId
              ? this.identityService.tryToGetNameFromNationalId(actorNationalId)
              : Promise.resolve(undefined),
          ])

          if (subjectName) {
            if (!actorName || subjectNationalId === actorNationalId) {
              subjectAndActorText = formatMessage(
                coreHistoryMessages.byReviewer,
                { subject: subjectName },
              )
            } else {
              subjectAndActorText = formatMessage(
                coreHistoryMessages.byReviewerWithActor,
                { subject: subjectName, actor: actorName },
              )
            }
          }
        }

        result.push(
          new HistoryResponseDto(
            entryTimestamp,
            historyLog.logMessage,
            formatMessage,
            subjectAndActorText,
          ),
        )
      }
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }
}
