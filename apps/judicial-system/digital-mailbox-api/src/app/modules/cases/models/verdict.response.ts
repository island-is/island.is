import { ApiProperty } from '@nestjs/swagger'

import {
  formatDate,
  getRulingInstructionItems,
  getVerdictAppealDecision,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseIndictmentRulingDecision,
  getIndictmentAppealDeadline,
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

  @ApiProperty({ type: [Groups] })
  groups?: Groups[]

  @ApiProperty({ type: String })
  appealDecision?: VerdictAppealDecision

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    nationalId: string,
    lang?: string,
  ): VerdictResponse {
    const t = getTranslations(lang)

    const defendant =
      internalCase.defendants?.find((def) => def.nationalId === nationalId) ||
      internalCase.defendants?.[0]

    const verdict = defendant?.verdict

    const isServiceRequired =
      verdict?.serviceRequirement === ServiceRequirement.REQUIRED

    const isFine =
      internalCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.FINE

    const baseDate = isServiceRequired
      ? verdict?.serviceDate
      : internalCase.rulingDate

    const appealDeadlineResult = baseDate
      ? getIndictmentAppealDeadline({
          baseDate: new Date(baseDate),
          isFine,
        })
      : undefined
    const appealDeadline = appealDeadlineResult?.deadlineDate
    const isAppealDeadlineExpired =
      appealDeadlineResult?.isDeadlineExpired ?? false

    // Default judgements can't be appealed
    const canBeAppealed = !!verdict && !verdict.isDefaultJudgement

    const rulingInstructionsItems = getRulingInstructionItems(
      verdict?.serviceInformationForDefendant ?? [],
      lang,
    )

    return {
      caseId: internalCase.id,
      title: t.rulingTitle,
      appealDecision: verdict?.appealDecision,
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
            ...(canBeAppealed
              ? [
                  [
                    t.appealDeadline,
                    appealDeadline
                      ? formatDate(appealDeadline)
                      : t.notAvailable,
                  ],
                ]
              : []),
            ...(canBeAppealed && isAppealDeadlineExpired
              ? [
                  [
                    t.appealDecision,
                    getVerdictAppealDecision(verdict?.appealDecision),
                  ],
                ]
              : []),
          ].map((item) => ({
            label: item[0],
            value: item[1],
          })),
        },
        {
          label: t.ruling,
          items: [
            {
              // there should only be one ruling judgement over all court sessions
              // for digital-mailbox we specifically fetch court sessions in descending order and filter out other non verdict ruling types
              value:
                internalCase.courtSessions?.[0]?.ruling ??
                internalCase.ruling ??
                '',
              type: 'text',
            },
          ],
        },
        ...(canBeAppealed && !isAppealDeadlineExpired
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
