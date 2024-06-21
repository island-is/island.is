import { ApiProperty } from '@nestjs/swagger'

import { formatDate } from '@island.is/judicial-system/formatters'
import { DateType } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

class IndictmentCaseData {
  @ApiProperty({ type: String })
  caseNumber!: string

  @ApiProperty({ type: [Groups] })
  groups!: Groups[]
}

export class CaseResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: IndictmentCaseData })
  data!: IndictmentCaseData

  static fromInternalCaseResponse(
    res: InternalCaseResponse,
    lang?: string,
  ): CaseResponse {
    const t = getTranslations(lang)
    const defendant = res.defendants[0]
    const subpoenaDateLog = res.dateLogs?.find(
      (dateLog) => dateLog.dateType === DateType.ARRAIGNMENT_DATE,
    )
    const subpoenaCreatedDate = subpoenaDateLog?.created.toString() ?? ''

    return {
      caseId: res.id,
      data: {
        caseNumber: `${t.caseNumber} ${res.courtCaseNumber}`,
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
                value: res.courtCaseNumber,
              },
              {
                label: t.court,
                value: res.court.name,
              },
              {
                label: t.judge,
                value: res.judge.name,
              },
              {
                label: t.institution,
                value: res.prosecutorsOffice.name,
              },
              {
                label: t.prosecutor,
                value: res.prosecutor.name,
              },
            ],
          },
        ],
      },
    }
  }
}
