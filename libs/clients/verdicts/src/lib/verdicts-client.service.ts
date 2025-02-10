import { Injectable } from '@nestjs/common'

import { sortAlpha } from '@island.is/shared/utils'
import { VerdictApi } from '../../gen/fetch/gopro'
import { DefaultApi } from '../../gen/fetch/supreme-court'

const ITEMS_PER_PAGE = 10

@Injectable()
export class VerdictsClientService {
  constructor(
    private readonly goproApi: VerdictApi,
    private readonly supremeCourtApi: DefaultApi,
  ) {}

  async getVerdicts(input: { pageNumber: number; searchTerm: string }) {
    // TODO: use input
    const [goproResponse, supremeCourtResponse] = await Promise.all([
      this.goproApi.getVerdicts({
        requestData: {
          orderBy: 'verdictDate desc',
          itemsPerPage: ITEMS_PER_PAGE,
          pageNumber: input.pageNumber,
          searchTerm: input.searchTerm,
        },
      }),
      this.supremeCourtApi.apiV2VerdictGetVerdictsGet({
        page: input.pageNumber,
        limit: ITEMS_PER_PAGE,
        orderBy: 'verdictDate DESC',
      }),
    ])

    const items: {
      id: string
      title: string
      court: string
      caseNumber: string
      verdictDate: Date
      presidentJudge?: { name?: string; title?: string }
      keywords: string[]
      presentings: string
    }[] = []

    for (const goproItem of goproResponse.items ?? []) {
      if (
        Boolean(goproItem.id) &&
        Boolean(goproItem.title) &&
        Boolean(goproItem.court) &&
        Boolean(goproItem.caseNumber) &&
        Boolean(goproItem.verdictDate)
      ) {
        items.push({
          id: `g-${goproItem.id}`,
          title: goproItem.title as string,
          court: goproItem.court as string,
          caseNumber: goproItem.caseNumber as string,
          verdictDate: goproItem.verdictDate as Date,
          presidentJudge: goproItem.judges?.find((judge) =>
            Boolean(judge?.isPresident),
          ),
          keywords: goproItem.keywords ?? [],
          presentings: goproItem.presentings ?? '',
        })
      }
    }

    for (const supremeCourtItem of supremeCourtResponse.items ?? []) {
      if (
        Boolean(supremeCourtItem.id) &&
        Boolean(supremeCourtItem.title) &&
        Boolean(supremeCourtItem.court) &&
        Boolean(supremeCourtItem.caseNumber) &&
        Boolean(supremeCourtItem.verdictDate)
      ) {
        items.push({
          id: `s-${supremeCourtItem.id}`,
          title: supremeCourtItem.title as string,
          court: supremeCourtItem.court as string,
          caseNumber: supremeCourtItem.caseNumber as string,
          verdictDate: supremeCourtItem.verdictDate as Date,
          presidentJudge: supremeCourtItem.judges?.find((judge) =>
            Boolean(judge?.isPresident),
          ),
          keywords: supremeCourtItem.keywords ?? [],
          presentings: '', // TODO: Reifun is missing
        })
      }
    }

    return {
      total: supremeCourtResponse.total ?? 0,
      items,
    }
  }

  async getSingleVerdictById(id: string) {
    if (id.startsWith('g-')) {
      const response = await this.goproApi.getVerdict({
        id,
      })

      const content = response.item?.docContent

      if (!content) {
        return null
      }

      return {
        item: {
          content,
          type: 'pdf',
        },
      }
    }

    const response = await this.supremeCourtApi.apiV2VerdictIdGet({
      id,
    })

    const content = response.item?.verdictHtml

    if (!content) {
      return null
    }

    return {
      item: {
        content,
        type: 'html',
      },
    }
  }

  async getCaseTypes() {
    const [goproResponse, supremeCourtResponse] = await Promise.all([
      this.goproApi.getCaseTypes({}),
      this.supremeCourtApi.apiV2VerdictGetCaseTypesGet(),
    ])

    const items = (goproResponse.items ?? []).concat(
      supremeCourtResponse.items ?? [],
    )

    const caseTypeSet = new Set<string>()

    for (const item of items) {
      if (item.label) {
        caseTypeSet.add(item.label)
      }
    }

    const caseTypes = Array.from(items)
    caseTypes.sort(sortAlpha('label'))

    return {
      caseTypes: caseTypes.map(({ label }) => ({ label: label as string })),
    }
  }

  async getCaseCategories() {
    const [goproResponse] = await Promise.all([
      this.goproApi.getCaseCategories({}),
    ])

    const categories = Array.from(goproResponse.items ?? [])
    categories.sort(sortAlpha('label'))

    return {
      caseCategories: categories.map(({ label }) => ({
        label: label as string,
      })),
    }
  }

  async getKeywords() {
    const [goproResponse, supremeCourtResponse] = await Promise.all([
      this.goproApi.getKeywords({}),
      this.supremeCourtApi.apiV2VerdictGetKeywordsGet(),
    ])

    const items = (goproResponse.items ?? []).concat(
      supremeCourtResponse.items ?? [],
    )
    const keywordSet = new Set<string>()

    for (const item of items) {
      if (item.label) {
        keywordSet.add(item.label)
      }
    }

    const keywords = Array.from(items)
    keywords.sort(sortAlpha('label'))

    return {
      keywords: keywords.map(({ label }) => ({ label: label as string })),
    }
  }
}
