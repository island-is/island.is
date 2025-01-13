import { Injectable } from '@nestjs/common'

import {
  GetVerdictsOperationRequest,
  VerdictApi,
  type DetailedVerdictData,
} from '../../gen/fetch/'

@Injectable()
export class VerdictsClientService {
  constructor(private readonly verdictApi: VerdictApi) {}

  async getVerdicts(input: GetVerdictsOperationRequest['requestData']) {
    // TODO: use input
    const response = await this.verdictApi.getVerdicts({
      requestData: {
        courtLevel: '',
        caseCategory: '',
        caseType: '',
        caseNumber: '',
        title: '',
        keywords: [''],
        laws: [''],
        dateFrom: '',
        dateTo: '',
        orderBy: 'title', // TODO: how should the verdicts be ordered?
        pageNumber: 1,
        itemsPerPage: 10,
        ...input,
      },
    })

    return {
      items: (
        (response.items?.filter(
          (item) =>
            Boolean(item.id) &&
            Boolean(item.title) &&
            Boolean(item.court) &&
            Boolean(item.caseNumber) &&
            Boolean(item.verdictDate) &&
            Boolean(item.presentings),
        ) ?? []) as (DetailedVerdictData & {
          id: string
          title: string
          court: string
          caseNumber: string
          verdictDate: Date
          presentings: string
        })[]
      ).map((item) => ({
        id: item.id,
        title: item.title,
        court: item.court,
        caseNumber: item.caseNumber,
        verdictDate: item.verdictDate,
        presidentJudge: item.judges?.find((judge) =>
          Boolean(judge?.isPresident),
        ),
        keywords: item.keywords ?? [],
        presentings: item.presentings,
      })),
    }
  }

  async getSingleVerdictById(id: string) {
    const response = await this.verdictApi.getVerdict({
      id,
    })

    if (!response.item?.title) {
      return null
    }

    return {
      item: {
        title: response.item.title,
      },
    }
  }
}
