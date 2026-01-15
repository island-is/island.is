import {
  Application,
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
    application: Application,
    currentUserRole: string,
    currentUserNationalId: string,
    isAdmin: boolean,
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
        // Only fetch subject/actor name by nationalId if necessary
        let subjectName: string | undefined
        let actorName: string | undefined
        const includeSubjectAndActor: boolean | undefined =
          typeof historyLog.includeSubjectAndActor === 'function'
            ? historyLog.includeSubjectAndActor(
                currentUserRole,
                currentUserNationalId,
                isAdmin,
              )
            : historyLog.includeSubjectAndActor
        if (includeSubjectAndActor && (subjectNationalId || actorNationalId)) {
          ;[subjectName, actorName] = await Promise.all([
            subjectNationalId
              ? this.identityService
                  .tryToGetNameFromNationalId(subjectNationalId)
                  .then((name) => name ?? subjectNationalId)
              : Promise.resolve(undefined),

            actorNationalId
              ? this.identityService
                  .tryToGetNameFromNationalId(actorNationalId)
                  .then((name) => name ?? actorNationalId)
              : Promise.resolve(undefined),
          ])
        }

        const message =
          typeof historyLog.logMessage === 'function'
            ? historyLog.logMessage(application, subjectNationalId)
            : historyLog.logMessage

        let subjectAndActorText: string | undefined
        if (subjectName) {
          if (actorName && subjectNationalId !== actorNationalId) {
            subjectAndActorText = formatMessage(
              coreHistoryMessages.byReviewerWithActor,
              { subject: subjectName, actor: actorName },
            )
          } else {
            subjectAndActorText = formatMessage(
              coreHistoryMessages.byReviewer,
              { subject: subjectName },
            )
          }
        }

        result.push(
          new HistoryResponseDto(
            entryTimestamp,
            message,
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
