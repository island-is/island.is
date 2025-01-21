import { Injectable } from '@nestjs/common'

import { isDefined } from '@island.is/shared/utils'
import {
  GetVerdictsOperationRequest,
  VerdictApi,
  type DetailedVerdictData,
} from '../../gen/fetch/'

const ITEMS_PER_PAGE = 10

const filterIdAndLabel = (entity?: {
  id?: number
  label?: string
}): entity is { id: number; label: string } =>
  isDefined(entity?.id) && Boolean(entity?.label)

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
        orderBy: 'verdictDate desc',
        pageNumber: 1,
        itemsPerPage: ITEMS_PER_PAGE,
        ...input,
      },
    })

    // TODO: what if they do not provide a total
    const total = response.total ?? 0

    return {
      total,
      items: (
        response.items?.filter(
          (
            item,
          ): item is DetailedVerdictData & {
            id: string
            title: string
            court: string
            caseNumber: string
            verdictDate: Date
            presentings?: string
          } =>
            Boolean(item.id) &&
            Boolean(item.title) &&
            Boolean(item.court) &&
            Boolean(item.caseNumber) &&
            Boolean(item.verdictDate),
        ) ?? []
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
        presentings: item.presentings ?? '',
      })),
    }
  }

  async getSingleVerdictById(id: string) {
    const response = await this.verdictApi.getVerdict({
      id,
    })

    const content = response.item?.docContent

    if (!content) {
      return null
    }

    return {
      item: {
        content,
      },
    }
  }

  async getCaseTypes() {
    const response = await this.verdictApi.getCaseTypes({})
    return {
      caseTypes: response.items?.filter(filterIdAndLabel) ?? [],
    }
  }

  async getCaseCategories() {
    const response = await this.verdictApi.getCaseCategories({})
    return {
      caseCategories: response.items?.filter(filterIdAndLabel) ?? [],
    }
  }

  async getKeywords() {
    const response = await this.verdictApi.getKeywords({})
    return {
      keywords: response.items?.filter(filterIdAndLabel) ?? [],
    }
  }
}
