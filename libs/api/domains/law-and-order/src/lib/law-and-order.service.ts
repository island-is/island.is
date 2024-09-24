import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type { Locale } from '@island.is/shared/types'
import {
  CasesResponse,
  Defender,
  JudicialSystemSPClientService,
  SubpoenaResponse,
} from '@island.is/clients/judicial-system-sp'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { DefenseChoices, mapDefenseChoice } from './helpers/mappers'
import { Item } from '../models/item.model'
import { Lawyers } from '../models/lawyers.model'
import { ActionTypeEnum } from '../models/actions.model'
import { IntlService } from '@island.is/cms-translations'
import { isDefined } from '@island.is/shared/utils'
import { DefenseChoiceEnum } from '../models/defenseChoiceEnum.model'

const namespaces = ['api.law-and-order']
@Injectable()
export class LawAndOrderService {
  constructor(
    private api: JudicialSystemSPClientService,
    private readonly intlService: IntlService,
  ) {}

  async getCourtCases(user: User, locale: Locale) {
    const cases: Array<CasesResponse> | null = await this.api.getCases(
      user,
      locale,
    )
    if (cases === null) return null

    return {
      cases:
        cases?.map((x: CasesResponse) => {
          return {
            id: x.id,
            caseNumber: x.caseNumber,
            caseNumberTitle: x.caseNumber,
            state: x.state,
            type: x.type,
          }
        }) ?? [],
    }
  }

  async getCourtCase(user: User, id: string, locale: Locale) {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)
    const singleCase = await this.api.getCase(id, user, locale)
    const isSubpoenaAcknowledged = singleCase?.data.acknowledged

    const subpoenaString = formatMessage({
      id: 'api.law-and-order:subpoena',
      defaultMessage: 'Fyrirkall',
    })
    const seeSubpoenaString = formatMessage({
      id: 'api.law-and-order:see-subpoena',
      defaultMessage: 'Sjá fyrirkall',
    })
    const seeSubpoenaInMailboxString = formatMessage({
      id: 'api.law-and-order:see-subpoena-in-mailbox',
      defaultMessage: 'Sjá fyrirkall í pósthólfi',
    })

    const subpoenaSentIndex = singleCase?.data.groups[0].items.findIndex(
      (item) => item.label.includes(subpoenaString),
    )

    // If the subpoena has not been acknowledged
    // add an action to the line including "fyrirkall" to redirect to the digital mailbox
    const subpoenaSentItem: Item | undefined = {
      action: !isSubpoenaAcknowledged
        ? {
            data: '/postholf',
            title: isSubpoenaAcknowledged
              ? seeSubpoenaString
              : seeSubpoenaInMailboxString,
            type: ActionTypeEnum.file,
          }
        : undefined,
    }

    return {
      data: {
        id: singleCase?.caseId ?? id,
        acknowledged: isSubpoenaAcknowledged,
        caseNumber: singleCase?.data.caseNumber,
        caseNumberTitle: singleCase?.data.caseNumber,
        groups: singleCase?.data.groups.map((group, groupIndex) => {
          return {
            items: group.items.map((item, itemIndex) => {
              // Adding action to the line including "fyrirkall"
              if (groupIndex === 0 && itemIndex === subpoenaSentIndex) {
                return { ...item, action: subpoenaSentItem.action }
              }
              return item
            }),
            label: group.label,
          }
        }),
      },

      texts: undefined,
    }
  }

  async getSubpoena(user: User, id: string, locale: Locale) {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)

    const subpoena: SubpoenaResponse | undefined | null =
      await this.api.getSubpoena(id, user, locale)

    const defenderChoice = subpoena?.defenderInfo.defenderChoice
    const message = defenderChoice
      ? formatMessage(
          DefenseChoices[subpoena?.defenderInfo.defenderChoice].message,
        )
      : ''

    return {
      data: {
        id: subpoena?.caseId ?? id,
        acknowledged: subpoena?.data.acknowledged,
        chosenDefender: [message, subpoena?.defenderInfo?.defenderName]
          .filter(isDefined)
          .join(', '),
        defenderChoice: subpoena?.defenderInfo?.defenderChoice,
        groups: subpoena?.data.groups,
      },
      actions: undefined,
    }
  }

  async getLawyers(user: User, locale: Locale) {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)

    const answer: Array<Defender> | undefined | null =
      await this.api.getLawyers(user)
    const list: Lawyers = { lawyers: [] }
    answer?.map((x) => {
      list.lawyers?.push({
        title: [x.name, x.practice].filter(isDefined).join(', '),
        nationalId: x.nationalId,
      })
    })

    list.choices = Object.entries(DefenseChoices).map(([code, value]) => ({
      id: code,
      label: formatMessage(value.message),
    }))

    return list
  }

  async postDefenseChoice(
    user: User,
    input: PostDefenseChoiceInput,
    locale: Locale,
  ) {
    if (!input || !input.choice) return null

    return await this.api.patchSubpoena(
      {
        caseId: input.caseId,
        updateSubpoenaDto: {
          defenderChoice: mapDefenseChoice(input.choice),
          defenderNationalId: input.lawyersNationalId,
        },
        locale: locale,
      },
      user,
    )
  }
}
