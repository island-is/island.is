import { Injectable } from "@nestjs/common"
import { PoliceCasesClientService } from "@island.is/clients/police-cases"
import type { User } from '@island.is/auth-nest-tools'
import { mapPoliceCase } from "../mappers/policeCaseMapper"
import { isDefined } from "@island.is/shared/utils"
import { PaginantedCaseCollection } from "../models/police-cases/paginatedCaseCollection.model"


@Injectable()
export class PoliceCasesService {
  constructor(
    private policeApi: PoliceCasesClientService,
  ) { }

  async getCases(user: User): Promise<PaginantedCaseCollection> {
    const { cases } = await this.policeApi.getCases(
      user,
    )

    if (!cases || cases.length <= 0) {
      return {
        data: [],
        totalCount: 0,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        }
      }
    }

    return {
      data: cases.map(mapPoliceCase).filter(isDefined) ?? [],
      totalCount: cases.length,
      pageInfo: {
        //temporary
        hasNextPage: false,
        hasPreviousPage: false,
      }
    }
  }

  async getCase(user: User, caseNumber: string) {
    const cases = await this.getCases(user)
    return cases.data.find(c => c.number === caseNumber)
  }
}
