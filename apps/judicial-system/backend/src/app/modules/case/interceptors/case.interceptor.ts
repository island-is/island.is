import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  DefendantEventType,
} from '@island.is/judicial-system/types'

import { Defendant, DefendantEventLog } from '../../defendant'
import { EventLog } from '../../event-log'
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
  const prosecutorRepresentativeProps =
    prosecutor?.name && prosecutor?.nationalId
      ? {
          name: prosecutor.name,
          nationalId: prosecutor.nationalId,
          caseFileCategory: CaseFileCategory.PROSECUTOR_CASE_FILE,
        }
      : undefined

  const getDefenderRepresentativeProps = (theCase: Case) => {
    const { defenderName, defenderNationalId } = theCase
    if (!(defenderName && defenderNationalId)) return undefined

    return {
      name: defenderName,
      nationalId: defenderNationalId,
      caseFileCategory: CaseFileCategory.DEFENDANT_CASE_FILE,
    }
  }

  const civilClaimantSpokespersons = civilClaimants?.map((civilClaimant) => {
    const { spokespersonName, spokespersonNationalId, spokespersonIsLawyer } =
      civilClaimant
    if (!(spokespersonName && spokespersonNationalId)) return undefined

    return {
      name: spokespersonName,
      nationalId: spokespersonNationalId,
      caseFileCategory: spokespersonIsLawyer
        ? CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE
        : CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
    }
  })

  const defendants = theCase.defendants?.map((defendant) => ({
    name: defendant.name,
    nationalId: defendant.nationalId,
    caseFileCategory: CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
  }))
  return [
    prosecutorRepresentativeProps,
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
