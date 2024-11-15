import { map } from 'rxjs/operators'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import { Defendant } from '../models/defendant.model'

@Injectable()
export class DefendantInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((defendants: Defendant[]) =>
        defendants.map((defendant) => {
          return {
            id: defendant.id,
            created: defendant.created,
            modified: defendant.modified,
            caseId: defendant.caseId,
            case: defendant.case,
            noNationalId: defendant.noNationalId,
            nationalId: defendant.nationalId,
            name: defendant.name,
            gender: defendant.gender,
            address: defendant.address,
            citizenship: defendant.citizenship,
            defenderName: defendant.defenderName,
            defenderNationalId: defendant.defenderNationalId,
            defenderEmail: defendant.defenderEmail,
            defenderPhoneNumber: defendant.defenderPhoneNumber,
            defenderChoice: defendant.defenderChoice,
            defendantPlea: defendant.defendantPlea,
            serviceRequirement: defendant.serviceRequirement,
            verdictViewDate: defendant.verdictViewDate,
            verdictAppealDate: defendant.verdictAppealDate,
            subpoenaType: defendant.subpoenaType,
            subpoenas: defendant.subpoenas,
            requestedDefenderChoice: defendant.requestedDefenderChoice,
            requestedDefenderNationalId: defendant.requestedDefenderNationalId,
            requestedDefenderName: defendant.requestedDefenderName,
            isDefenderChoiceConfirmed: defendant.isDefenderChoiceConfirmed,
            caseFilesSharedWithDefender: defendant.caseFilesSharedWithDefender,
            isSentToPrisonAdmin: defendant.isSentToPrisonAdmin,
          }
        }),
      ),
    )
  }
}
