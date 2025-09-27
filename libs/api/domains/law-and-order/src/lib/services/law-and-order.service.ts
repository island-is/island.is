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
import { Subpoena } from '../models/summon.model'
import {
  DefenseChoices,
  mapDefenseChoice,
  mapDefenseChoiceForSummon,
  mapDefenseChoiceForSummonDefaultChoice,
  mapTagTypes,
} from './helpers/mappers'
import { m } from './messages'

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

    const summonString = formatMessage(m.summon)
    const seeSummonString = formatMessage(m.seeSummon)
    const seeSummonInMailboxString = formatMessage(m.seeSummonInMailbox)
    const mailboxLink = formatMessage(m.mailboxLink)
    const summonLink = m.summonLink

    // If the summon has not been acknowledged
    // add an action to the line including "fyrirkall" to redirect to the digital mailbox or detail page
    const summonSentItem: Item | undefined = {
      action: {
        data: hasBeenServed
          ? formatMessage(summonLink, { caseId: singleCase?.caseId })
          : mailboxLink,
        title: hasBeenServed ? seeSummonString : seeSummonInMailboxString,
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
                item.label.toLowerCase().includes(summonString.toLowerCase())
              ) {
                return { ...item, action: summonSentItem.action }
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

  async getSummon(user: User, id: string, locale: Locale) {
    const { formatMessage } = await this.intlService.useIntl(namespaces, locale)

    const summon: SubpoenaResponse | null = await this.api.getSummon(
      id,
      user,
      locale,
    )

    if (!isDefined(summon)) return null
    const summonData = summon.data
    if (!isDefined(summonData)) return null

    const defenderInfo = summon.defenderInfo
    const defenderChoice = defenderInfo?.defenderChoice
    const message = defenderChoice
      ? formatMessage(DefenseChoices[defenderChoice].message)
      : ''

    const data: Subpoena = {
      data: {
        id: summon.caseId ?? id,
        hasBeenServed: summonData.hasBeenServed,
        chosenDefender: [message, defenderInfo?.defenderName]
          .filter(isDefined)
          .join(', '),
        defenderChoice: mapDefenseChoiceForSummon(defenderChoice),
        defaultChoice: mapDefenseChoiceForSummonDefaultChoice(
          summonData.defaultDefenderChoice,
        ),
        hasChosen: summonData.hasChosenDefender,
        canEditDefenderChoice: defenderInfo?.canEdit,
        groups: summonData.groups,
        courtContactInfo: defenderInfo?.courtContactInfo,
      },
      actions: undefined,
      texts: {
        confirmation: summonData.alerts?.find(
          (alert) => alert.type === AlertMessageTypeEnum.Success,
        )?.message,
        description: summonData.subtitle,
        information: summonData.subpoenaInfoText,
        deadline: summonData.subpoenaNotificationDeadline,
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

    return await this.api.patchSummon(
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
