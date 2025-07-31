import { option } from 'fp-ts'
import { filterMap } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'

import { ApiProperty } from '@nestjs/swagger'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseIndictmentRulingDecision,
  getIndictmentAppealDeadlineDate,
  hasDatePassed,
  informationForDefendantMap,
  ServiceRequirement,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

export class VerdictResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: String })
  title!: string

  @ApiProperty({ type: String })
  subtitle?: string

  @ApiProperty({ enum: VerdictAppealDecision })
  appealDecision?: VerdictAppealDecision

  @ApiProperty({ type: [Groups] })
  groups?: Groups[]

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    nationalId: string,
    lang?: string,
  ): VerdictResponse {
    const t = getTranslations(lang)

    const defendant =
      internalCase.defendants?.find((def) => def.nationalId === nationalId) ||
      internalCase.defendants?.[0]

    const isServiceRequired =
      defendant?.verdict?.serviceRequirement === ServiceRequirement.REQUIRED
    const isFineCase =
      internalCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.FINE

    const baseDate = isServiceRequired
      ? defendant?.verdict?.serviceDate
      : internalCase.rulingDate

    const appealDeadline = baseDate
      ? getIndictmentAppealDeadlineDate(new Date(baseDate), isFineCase)
      : null

    const isAppealDeadlineExpired = appealDeadline
      ? hasDatePassed(appealDeadline)
      : false

    const rulingInstructionsItems = pipe(
      defendant?.verdict?.serviceInformationForDefendant ?? [],
      filterMap((information) => {
        const value = informationForDefendantMap.get(information)
        if (!value) {
          return option.none
        }
        return option.some({
          label: value.label,
          value: value.description,
          type: 'text',
        })
      }),
    )

    return {
      caseId: internalCase.id,
      title: t.rulingTitle,
      // subtitle: 'TODO subtitle (if needed)',
      appealDecision: defendant?.verdict?.appealDecision,
      groups: [
        {
          label: t.rulingTitle,
          items: [
            [
              t.rulingDate,
              internalCase.rulingDate
                ? formatDate(internalCase.rulingDate)
                : t.notAvailable,
            ],
            [t.court, internalCase.court?.name || t.notAvailable],
            [t.caseNumber, internalCase.courtCaseNumber || t.notAvailable],
            [
              t.appealDeadline,
              appealDeadline ? formatDate(appealDeadline) : t.notAvailable,
            ],
          ].map((item) => ({
            label: item[0],
            value: item[1],
          })),
        },
        // Ruling text
        {
          label: t.ruling,
          items: [
            {
              // This should be replaced with the actual ruling text
              // but we don't have that stored right now.
              value: 'TODO Ruling text goes here',
              type: 'text',
            },
          ],
        },
        ...(!isAppealDeadlineExpired
          ? [
              {
                label: t.appealDecision,
                items: [
                  {
                    value: t.appealDecisionText,
                    type: 'text' as const,
                  },
                  {
                    label: t.appealDecisionPostpone,
                    value: CaseAppealDecision.POSTPONE,
                    type: 'radioButton' as const,
                  },
                  {
                    label: t.appealDecisionAccept,
                    value: CaseAppealDecision.ACCEPT,
                    type: 'radioButton' as const,
                  },
                ],
              },
            ]
          : []),
        {
          label: t.rulingInstructions,
          items: rulingInstructionsItems,
        },
      ],
    }
  }
}
