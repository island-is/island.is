import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'
import {
  CasesResponse,
  JudicialSystemSPClientService,
  SubpoenaResponse,
} from '@island.is/clients/judicial-system-sp'
import { CourtCases } from '../models/courtCases.model'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { mapDefenseChoice } from './helpers/mappers'
import { Item } from '../models/item.model'

@Injectable()
export class LawAndOrderService {
  constructor(private api: JudicialSystemSPClientService) {}

  async getCourtCases(user: User, locale: Locale) {
    const cases: Array<CasesResponse> | null = await this.api.getCases(
      user,
      locale,
    )
    if (cases === null) return null

    const list: CourtCases = { items: [] }
    const randomBoolean = Math.random() < 0.75

    cases?.map((x: CasesResponse) => {
      list.items?.push({
        id: x.id,
        acknowledged: randomBoolean,
        caseNumber: x.caseNumber,
        caseNumberTitle: x.caseNumber,
        state: x.state,
        type: x.type,
      })
    })

    return list
  }

  async getCourtCase(user: User, id: string, locale: Locale) {
    const singleCase = await this.api.getCase(id, user, locale)
    const isSubpoenaAcknowledged = singleCase?.data.acknowledged

    const subpoenaString = locale === 'is' ? 'Fyrirkall' : 'Subpoena'
    const subpoenaSentIndex = singleCase?.data.groups[0].items.findIndex(
      (item) => item.label.includes(subpoenaString),
    )

    // If the subpoena has not been acknowledged
    // add an action to the line including "fyrirkall" to redirect to the digital mailbox
    const subpoenaSentItem: Item | undefined = {
      action: !isSubpoenaAcknowledged
        ? {
            data: '/postholf',
            title:
              locale === 'is'
                ? isSubpoenaAcknowledged
                  ? 'Sjá fyrirkall'
                  : 'Sjá fyrirkall í pósthólfi'
                : isSubpoenaAcknowledged
                ? 'See subpoena'
                : 'See subpoena in mailbox',
            type: 'inbox',
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
    const subpoena: SubpoenaResponse | undefined | null =
      await this.api.getSubpoena(id, user, locale)

    return {
      data: {
        id: subpoena?.caseId ?? id,
        acknowledged: subpoena?.data.acknowledged,
        chosenDefender: subpoena?.defenderInfo?.defenderName,
        defenderChoice: subpoena?.defenderInfo?.defenderChoice,
        groups: subpoena?.data.groups,
      },
      actions: undefined,
    }
  }

  async getLawyers(user: User) {
    return await this.api.getLawyers(user)
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
