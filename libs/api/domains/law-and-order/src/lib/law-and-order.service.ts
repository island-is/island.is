import type { User } from '@island.is/auth-nest-tools'
import {
  AlertMessageTypeEnum,
  CasesResponse,
  Defender,
  JudicialSystemSPClientService,
  SubpoenaResponse,
} from '@island.is/clients/judicial-system-sp'
import { IntlService } from '@island.is/cms-translations'
import type { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Injectable } from '@nestjs/common'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { ActionTypeEnum } from '../models/actions.model'
import { CourtCase } from '../models/courtCase.model'
import { CourtCases } from '../models/courtCases.model'
import { Item } from '../models/item.model'
import { Lawyers } from '../models/lawyers.model'
import { Subpoena } from '../models/subpoena.model'
import {
  DefenseChoices,
  mapDefenseChoice,
  mapDefenseChoiceForSubpoena,
  mapDefenseChoiceForSubpoenaDefaultChoice,
  mapTagTypes,
} from './helpers/mappers'

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

    const data: CourtCases = {
      cases:
        cases?.map((x: CasesResponse) => {
          return {
            id: x.id,
            caseNumber: x.caseNumber,
            caseNumberTitle: x.caseNumber,
            state: { label: x.state.label, color: mapTagTypes(x.state.color) },
            type: x.type,
          }
        }) ?? [],
    }

    return data
  }

  async getCourtCase(user: User, id: string, locale: Locale) {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)
    const singleCase = await this.api.getCase(id, user, locale)
    const hasBeenServed = singleCase?.data.hasBeenServed

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
    const mailboxLink = formatMessage({
      id: 'api.law-and-order:mailbox-link',
      defaultMessage: '/postholf',
    })
    const subpoenaLink = {
      id: 'api.law-and-order:subpoena-link',
      defaultMessage: `/log-og-reglur/domsmal/{caseId}/fyrirkall`,
    }

    // If the subpoena has not been acknowledged
    // add an action to the line including "fyrirkall" to redirect to the digital mailbox or detail page
    const subpoenaSentItem: Item | undefined = {
      action: {
        data: hasBeenServed
          ? formatMessage(subpoenaLink, { caseId: singleCase?.caseId })
          : mailboxLink,
        title: hasBeenServed ? seeSubpoenaString : seeSubpoenaInMailboxString,
        type: hasBeenServed ? ActionTypeEnum.inbox : ActionTypeEnum.url,
      },
    }

    const data: CourtCase = {
      data: {
        id: singleCase?.caseId ?? id,
        hasBeenServed: hasBeenServed,
        caseNumberTitle: singleCase?.data.caseNumber,
        groups: (singleCase?.data.groups ?? []).map((group, groupIndex) => {
          return {
            items: group.items.map((item) => {
              // Adding action to the line including "fyrirkall"
              if (
                groupIndex === 0 &&
                item.label.toLowerCase().includes(subpoenaString.toLowerCase())
              ) {
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
    return data
  }

  async getSubpoena(user: User, id: string, locale: Locale) {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)

    const subpoena: SubpoenaResponse | null = await this.api.getSubpoena(
      id,
      user,
      locale,
    )

    if (!isDefined(subpoena)) return null
    const subpoenaData = subpoena.data
    if (!isDefined(subpoenaData)) return null

    const defenderInfo = subpoena.defenderInfo
    const defenderChoice = defenderInfo?.defenderChoice
    const message = defenderChoice
      ? formatMessage(DefenseChoices[defenderChoice].message)
      : ''

    const data: Subpoena = {
      data: {
        id: subpoena.caseId ?? id,
        hasBeenServed: subpoenaData.hasBeenServed,
        chosenDefender: [message, defenderInfo?.defenderName]
          .filter(isDefined)
          .join(', '),
        defenderChoice: mapDefenseChoiceForSubpoena(defenderChoice),
        defaultChoice: mapDefenseChoiceForSubpoenaDefaultChoice(
          subpoenaData.defaultDefenderChoice,
        ),
        hasChosen: subpoenaData.hasChosenDefender,
        canEditDefenderChoice: defenderInfo?.canEdit,
        groups: subpoenaData.groups,
        courtContactInfo: defenderInfo?.courtContactInfo,
      },
      actions: undefined,
      texts: {
        confirmation: subpoenaData.alerts?.find(
          (alert) => alert.type === AlertMessageTypeEnum.Success,
        )?.message,
        description: subpoenaData.subtitle,
      },
    }
    return data
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
