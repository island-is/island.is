import { Injectable } from '@nestjs/common'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import { CourtCases } from '../models/courtCases.model'
import { getCase, getLawyers, getSubpoena, listCases } from './helpers/mockData'
import { CourtCase } from '../models/courtCase.model'
import { Subpoena } from '../models/subpoena.model'
import { Lawyers } from '../models/lawyers.model'
import { DefenseChoice } from '../models/defenseChoice.model'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { PostSubpoenaAcknowledgedInput } from '../dto/postSubpeonaAcknowledgedInput.model'
import { SubpoenaAcknowledged } from '../models/subpoenaAcknowledged.model'
import { Locale } from 'locale'
import {
  CasesResponse,
  Defender,
  LawAndOrderClientService,
} from '@island.is/clients/law-and-order'

@Injectable()
export class LawAndOrderService {
  constructor(private api: LawAndOrderClientService) {}

  async getCourtCases(user: User, locale: Locale) {
    const answer: Array<CasesResponse> = await this.api.getCases(user)
    const mockAnswer = listCases(locale)
    const list: CourtCases = { items: [] }
    const randomBoolean = Math.random() < 0.75

    answer.map((x) => {
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
    //const answer = this.lawAndOrderApi.getTest(user)
    const mockAnswer = getCase(id, locale).data
    let data: CourtCase = {}

    data = {
      data: {
        id: id,
        acknowledged: mockAnswer?.data.acknowledged,
        caseNumber: mockAnswer?.data.caseNumber,
        caseNumberTitle: mockAnswer?.data.caseNumberTitle,
        groups: mockAnswer?.data.groups,
      },
      actions: mockAnswer?.actions,
      texts: mockAnswer?.texts,
    }

    return data
  }

  async getSubpoena(user: User, id: string, locale: Locale) {
    //const answer = this.lawAndOrderApi.getTest(user)
    const mockAnswer = getSubpoena(id).data
    let data: Subpoena = {}

    data = {
      data: {
        id: id,
        acknowledged: mockAnswer?.data.acknowledged,
        chosenDefender: mockAnswer?.data.chosenDefender,
        displayClaim: mockAnswer?.data.displayClaim,
        groups: mockAnswer?.data.groups,
      },
      actions: mockAnswer?.actions,
      texts: mockAnswer?.texts,
    }

    return data
  }

  async getLawyers(user: User, locale: Locale) {
    const answer: Array<Defender> = await this.api.getLawyers(user)
    const list: Lawyers = { items: [] }

    answer.map((x) => {
      list.items?.push({
        name: x.name,
        nationalId: x.nationalId,
        practice: x.practice,
      })
    })

    console.log('lawyers', list)
    return list
  }

  async isSubpoenaAcknowledged(user: User, id?: string) {
    //const answer = this.lawAndOrderApi.getTest(user)
    if (!id) return undefined
    const randomBoolean = Math.random() < 0.75

    return randomBoolean
  }

  async postDefenseChoice(user: User, input: PostDefenseChoiceInput) {
    if (!input) return null

    const res: DefenseChoice = {
      caseId: input.caseId,
      lawyersNationalId: input.lawyersNationalId,
      choice: input.choice,
    }

    return res
  }

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
