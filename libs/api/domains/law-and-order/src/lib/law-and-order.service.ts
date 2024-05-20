import { Injectable } from '@nestjs/common'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { CourtCases } from '../models/courtCases.model'
import { getCase, listCases } from './helpers/mockData'
import { LawAndOrderClientService } from '@island.is/clients/law-and-order'
import { CourtCase } from '../models/courtCase.model'

@Injectable()
export class LawAndOrderService {
  constructor(private lawAndOrderApi: LawAndOrderClientService) {}

  async getCourtCases(user: User) {
    // const answer = this.lawAndOrderApi.getTest(user)
    const mockAnswer = listCases()
    const list: CourtCases = { items: [] }

    mockAnswer.map((x) => {
      list.items?.push({
        id: x.data.id.toString(),
        acknowledged: x.data.acknowledged,
        caseNumber: x.data.caseNumber,
        caseNumberTitle: x.data.caseNumberTitle,
        state: { title: x.data.status },
        type: x.data.type,
      })
    })

    return list
  }

  async getCourtCase(user: User, id: string) {
    //const answer = this.lawAndOrderApi.getTest(user)
    const mockAnswer = getCase(id).data
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
}
