import { ApiProperty } from '@nestjs/swagger'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  DateType,
  isSuccessfulServiceStatus,
  UserRole,
} from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

class IndictmentCaseData {
  @ApiProperty({ type: String })
  caseNumber!: string

  @ApiProperty({ type: Boolean })
  hasBeenServed?: boolean

  @ApiProperty({ type: Boolean })
  hasRulingBeenServed?: boolean

  @ApiProperty({ type: [Groups] })
  groups!: Groups[]
}

export class CaseResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: IndictmentCaseData })
  data!: IndictmentCaseData

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    lang?: string,
  ): CaseResponse {
    const t = getTranslations(lang)
    const defendant = internalCase.defendants[0] ?? {}
    const subpoenaDateLog = internalCase.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
    const subpoenaCreatedDate = subpoenaDateLog?.created?.toString() ?? '' //TODO: Change to created from subpoena db entry?
    const subpoenas = defendant.subpoenas ?? []

    return {
      caseId: internalCase.id,
      data: {
        caseNumber: `${t.caseNumber} ${internalCase.courtCaseNumber}`,
        hasBeenServed:
          subpoenas.length > 0
            ? isSuccessfulServiceStatus(subpoenas[0].serviceStatus)
            : false,
        hasRulingBeenServed: false, // TODO: Implement logic to determine if the ruling has been served
        groups: [
          {
            label: t.defendant,
            items: [
              [t.name, defendant.name],
              [t.nationalId, defendant.nationalId],
              [t.address, defendant.address],
              [t.subpoenaSent, formatDate(subpoenaCreatedDate, 'PP')],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? t.notAvailable,
            })),
          },
          {
            label: t.defender,
            items: [
              [t.name, defendant.defenderName],
              [t.email, defendant.defenderEmail, 'email'],
              [t.phoneNumber, defendant.defenderPhoneNumber, 'tel'],
            ].map((item) => ({
              label: item[0] ?? '',
              value: item[1] ?? t.notAvailable,
              linkType: item[2] ?? undefined,
            })),
          },
          {
            label: t.information,
            items: [
              {
                label: t.type,
                value: t.indictment,
              },
              {
                label: t.courtCaseNumber,
                value: internalCase.courtCaseNumber,
              },
              {
                label: t.court,
                value: internalCase.court.name,
              },
              {
                label:
                  internalCase.judge.role === UserRole.DISTRICT_COURT_ASSISTANT
                    ? t.districtCourtAssistant
                    : t.judge,
                value: internalCase.judge.name,
              },
              {
                label: t.institution,
                value: internalCase.prosecutorsOffice.name,
              },
              {
                label: t.prosecutor,
                value: internalCase.prosecutor.name,
              },
            ],
          },
        ],
      },
    }
  }
}
