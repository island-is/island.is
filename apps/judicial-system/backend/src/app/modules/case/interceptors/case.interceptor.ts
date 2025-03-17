import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { DefendantEventType } from '@island.is/judicial-system/types'

import { Defendant, DefendantEventLog } from '../../defendant'
import { EventLog } from '../../event-log'
import { User } from '../../user/user.model'
import { Case } from '../models/case.model'
import { CaseString } from '../models/caseString.model'

export const transformDefendants = (defendants?: Defendant[]) => {
  return defendants?.map((defendant) => ({
    ...defendant.toJSON(),
    sentToPrisonAdminDate: defendant.isSentToPrisonAdmin
      ? DefendantEventLog.getDefendantEventLogTypeDate(
          DefendantEventType.SENT_TO_PRISON_ADMIN,
          defendant.eventLogs,
        )
      : undefined,
    openedByPrisonAdminDate: DefendantEventLog.getDefendantEventLogTypeDate(
      DefendantEventType.OPENED_BY_PRISON_ADMIN,
      defendant.eventLogs,
    ),
  }))
}

const transformCaseRepresentatives = (theCase: Case) => {
  const { prosecutor, civilClaimants } = theCase
  const getCaseUserRepresentativeProps = (user?: User) => {
    if (!user) return undefined

    return { name: user.name, nationalId: user.nationalId, title: user.title }
  }

  const getDefenderRepresentativeProps = (theCase: Case) => {
    const { defenderName, defenderNationalId } = theCase
    if (!(defenderName && defenderNationalId)) return undefined

    return {
      name: defenderName,
      nationalId: defenderNationalId,
      title: 'verjandi',
    }
  }

  const civilClaimantSpokespersons = civilClaimants?.map((civilClaimant) => {
    const { spokespersonName, spokespersonNationalId, spokespersonIsLawyer } =
      civilClaimant
    if (!(spokespersonName && spokespersonNationalId)) return undefined

    return {
      name: spokespersonName,
      nationalId: spokespersonNationalId,
      title: spokespersonIsLawyer ? 'lögmaður' : 'réttargæslumaður',
    }
  })

  const defendants = theCase.defendants?.map((defendant) => ({
    name: defendant.name,
    nationalId: defendant.nationalId,
    title: 'ákærði',
  }))
  return [
    getCaseUserRepresentativeProps(prosecutor),
    getDefenderRepresentativeProps(theCase),
    ...(civilClaimantSpokespersons ? civilClaimantSpokespersons : []),
    ...(defendants ? defendants : []),
  ].filter((representative) => !!representative)
}

const transformCase = (theCase: Case) => {
  return {
    ...theCase.toJSON(),
    defendants: transformDefendants(theCase.defendants),
    postponedIndefinitelyExplanation:
      CaseString.postponedIndefinitelyExplanation(theCase.caseStrings),
    civilDemands: CaseString.civilDemands(theCase.caseStrings),
    caseSentToCourtDate: EventLog.caseSentToCourtEvent(theCase.eventLogs)
      ?.created,
    caseRepresentatives: transformCaseRepresentatives(theCase),
  }
}

@Injectable()
export class CaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(transformCase))
  }
}

@Injectable()
export class CasesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(
        map((cases: Case[]) => cases.map((theCase) => transformCase(theCase))),
      )
  }
}
