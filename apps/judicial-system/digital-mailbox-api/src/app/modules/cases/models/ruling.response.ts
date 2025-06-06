import { ApiProperty } from '@nestjs/swagger'

import { CaseAppealDecision } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'
import { Groups } from './shared/groups.model'
import { getTranslations } from './utils/translations.strings'

export class RulingResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiProperty({ type: String })
  title!: string

  @ApiProperty({ type: String })
  subtitle!: string

  @ApiProperty({ type: [Groups] })
  groups!: Groups[]

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    lang?: string,
  ): RulingResponse {
    const t = getTranslations(lang)

    return {
      caseId: internalCase.id,
      title: t.rulingTitle,
      subtitle: 'TODO subtitle (if needed)',
      groups: [
        {
          label: t.rulingTitle,
          items: [
            [t.rulingDate, 'TODO Dagsetning'],
            [t.court, 'TODO Dómstóll'],
            [t.caseNumber, 'TODO Málsnr'],
            [t.appealDeadline, 'TODO Áfrýjunarfrestur'],
          ].map((item) => ({
            label: item[0],
            value: item[1],
          })),
        },
        {
          label: t.ruling,
          items: [
            {
              value: 'TODO Ruling text goes here', // This should be replaced with the actual ruling text
              type: 'richText',
            },
          ],
        },
        {
          label: t.appealDecision,
          items: [
            {
              value: t.appealDecisionText,
              type: 'text',
            },
            {
              label: t.appealDecisionPostpone,
              value: CaseAppealDecision.POSTPONE,
              type: 'radioButton',
            },
            {
              label: t.appealDecisionAccept,
              value: CaseAppealDecision.ACCEPT,
              type: 'radioButton',
            },
          ],
        },
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
