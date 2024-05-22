import { Injectable } from '@nestjs/common'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { CourtCases } from '../models/courtCases.model'
import { getCase, getLawyers, getSubpoena, listCases } from './helpers/mockData'
import { LawAndOrderClientService } from '@island.is/clients/law-and-order'
import { CourtCase } from '../models/courtCase.model'
import { Subpoena } from '../models/subpoena.model'
import { Lawyers } from '../models/lawyers.model'
import { DefenseChoice } from '../models/defenseChoice.model'
import { PostDefenseChoiceInput } from '../dto/postDefenseChoiceInput.model'
import { PostSubpoenaAcknowledgedInput } from '../dto/postSubpeonaAcknowledgedInput.model'
import { SubpoenaAcknowledged } from '../models/subpoenaAcknowledged.model'
import { Locale } from 'locale'

@Injectable()
export class LawAndOrderService {
  constructor(private lawAndOrderApi: LawAndOrderClientService) {}

  async getCourtCases(user: User, locale: Locale) {
    // const answer = this.lawAndOrderApi.getTest(user)
    const mockAnswer = listCases(locale)
    const list: CourtCases = { items: [] }

    mockAnswer.map((x) => {
      list.items?.push({
        id: x.data.id,
        acknowledged: x.data.acknowledged,
        caseNumber: x.data.caseNumber,
        caseNumberTitle: x.data.caseNumberTitle,
        state: { title: x.data.status },
        type: x.data.type,
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
    //const answer = this.lawAndOrderApi.getTest(user)
    const mockAnswer = getLawyers().data.items
    const list: Lawyers = { items: [] }

    mockAnswer.map((x) => {
      list.items?.push({
        name: x.name,
        nationalId: x.nationalId,
        practice: x.practice,
      })
    })

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
