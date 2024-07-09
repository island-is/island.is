import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'
import {
  CasesResponse,
  Defender,
  JudicialSystemSPClientService,
  SubpoenaResponse,
  UpdateSubpoenaDtoDefenderChoiceEnum,
  CaseControllerUpdateSubpoenaLocaleEnum,
} from '@island.is/clients/judicial-system-sp'
import { CourtCases } from '../models/courtCases.model'
import { getSubpoena } from './helpers/mockData'
import { CourtCase } from '../models/courtCase.model'
import { Subpoena } from '../models/subpoena.model'
import { Lawyers } from '../models/lawyers.model'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { PostSubpoenaAcknowledgedInput } from '../dto/postSubpeonaAcknowledgedInput.model'
import { SubpoenaAcknowledged } from '../models/subpoenaAcknowledged.model'
import { DefenseChoiceEnum } from '../models/defenseChoiceEnum.model'
import {
  mapCaseLocale,
  mapCasesLocale,
  mapDefenseChoice,
  mapSubpoenaLocale,
  mapUpdateSubpoenaLocale,
} from './helpers/mappers'

@Injectable()
export class LawAndOrderService {
  constructor(private api: JudicialSystemSPClientService) {}

  async getCourtCases(user: User, locale: Locale) {
    const caseLocale = mapCasesLocale(locale)
    const cases: Array<CasesResponse> | null = await this.api.getCases(
      user,
      caseLocale,
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
    const caseLocale = mapCaseLocale(locale)
    const singleCase = await this.api.getCase(id, user, caseLocale)
    if (singleCase === null) return null

    const randomBoolean = Math.random() < 0.75
    let data: CourtCase = {}

    data = {
      data: {
        id: singleCase?.caseId ?? id,
        acknowledged: randomBoolean, // temp while waiting for pósthólfs api
        caseNumber: singleCase?.data.caseNumber,
        caseNumberTitle: singleCase?.data.caseNumber,
        groups: singleCase?.data.groups,
      },
      actions: undefined,
      texts: undefined,
    }

    return data
  }

  async getSubpoena(user: User, id: string, locale: Locale) {
    const caseLocale = mapSubpoenaLocale(locale)
    const subpoena: SubpoenaResponse | undefined | null =
      await this.api.getSubpoena(id, user, caseLocale)

    if (subpoena === null) return null

    const mockAnswer = getSubpoena(id).data
    let data: Subpoena = {}

    data = {
      data: {
        id: subpoena?.caseId ?? id,
        acknowledged: undefined,
        chosenDefender: subpoena?.defenderInfo.defenderName,
        defenderChoice: subpoena?.defenderInfo.defenderChoice,
        displayClaim: subpoena?.acceptCompensationClaim,
        groups: subpoena?.data.groups,
      },
      actions: undefined,
      texts: mockAnswer?.texts,
    }

    return data
  }

  async getLawyers(user: User) {
    const answer: Array<Defender> | undefined | null =
      await this.api.getLawyers(user)
    const list: Lawyers = { items: [] }

    answer?.map((x) => {
      list.items?.push({
        name: x.name,
        nationalId: x.nationalId,
        practice: x.practice,
      })
    })

    return list
  }

  async postDefenseChoice(user: User, input: PostDefenseChoiceInput) {
    if (!input || !input.choice) return null

    const res = await this.api.patchSubpoena(
      {
        caseId: input.caseId,
        updateSubpoenaDto: {
          defenderChoice: mapDefenseChoice(input.choice), // eslint-disable-next-line local-rules/disallow-kennitalas
          defenderNationalId: input.lawyersNationalId,
          acceptCompensationClaim: false, // Remove when service has removed this field
        },
        locale: mapUpdateSubpoenaLocale(input.locale),
      },
      user,
    )
    return res
  }

  // TODO: Wait for pósthólfs api to be ready
  async isSubpoenaAcknowledged(user: User, id?: string) {
    if (!id) return undefined
    const randomBoolean = Math.random() < 0.75

    return randomBoolean
  }

  // TODO: Wait for pósthólfs api to be ready
  async postSubpoenaAcknowledged(
    user: User,
    input: PostSubpoenaAcknowledgedInput,
  ) {
    if (!input) return null

    const res: SubpoenaAcknowledged = {
      caseId: input.caseId,
      acknowledged: input.acknowledged,
    }

    return res
  }
}
