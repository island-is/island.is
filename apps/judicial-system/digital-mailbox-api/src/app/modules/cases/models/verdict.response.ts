import { ApiProperty } from '@nestjs/swagger'

import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseIndictmentRulingDecision,
  getIndictmentAppealDeadlineDate,
  hasDatePassed,
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
  verdictAppealDecision?: VerdictAppealDecision

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

    const serviceRequired =
      defendant?.serviceRequirement === ServiceRequirement.REQUIRED
    const isFineCase =
      internalCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.FINE

    const baseDate = serviceRequired
      ? defendant?.verdictViewDate
      : internalCase.rulingDate

    const appealDeadline = baseDate
      ? getIndictmentAppealDeadlineDate(new Date(baseDate), isFineCase)
      : null

    const isAppealDeadlineExpired = appealDeadline
      ? hasDatePassed(appealDeadline)
      : false

    return {
      caseId: internalCase.id,
      title: t.rulingTitle,
      // subtitle: 'TODO subtitle (if needed)',
      verdictAppealDecision: defendant?.verdictAppealDecision,
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
          //TODO: Replace with actual instructions
          items: [
            {
              label: 'Endurupptaka útivistarmála (í fjarveru þinni)',
              value:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
              type: 'text',
            },
            {
              label: 'Áfrýjun til Landsréttar og áfrýjunarfrestur',
              value:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
              type: 'text',
            },
            {
              label: 'Skilorðsbundin refsing og skilorðsrof',
              value:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
              type: 'text',
            },
            {
              label: 'Skilyrði og umsókn um samfélagsþjónustu',
              value:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
              type: 'text',
            },
          ],
        },
      ],
    }
  }
}
