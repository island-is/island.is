import { Injectable } from '@nestjs/common'
import sanitizeHtml from 'sanitize-html'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import { NodeHtmlMarkdown } from 'node-html-markdown'

import { VerdictApi } from '../../gen/fetch/gopro'
import { DefaultApi } from '../../gen/fetch/supreme-court'

const ITEMS_PER_PAGE = 10
const GOPRO_ID_PREFIX = 'g-'
const SUPREME_COURT_ID_PREFIX = 's-'

const convertHtmlToContentfulRichText = async (html: string, id: string) => {
  const sanitizedHtml = sanitizeHtml(html)
  const markdown = NodeHtmlMarkdown.translate(sanitizedHtml)
  const richText = await richTextFromMarkdown(markdown)
  return {
    __typename: 'Html',
    document: richText,
    id,
  }
}

@Injectable()
export class VerdictsClientService {
  constructor(
    private readonly goproApi: VerdictApi,
    private readonly supremeCourtApi: DefaultApi,
  ) {}

  async getVerdicts(input: {
    pageNumber: number
    searchTerm: string
    courtLevel?: string
  }) {
    const onlyFetchSupremeCourtVerdicts = input.courtLevel === 'Hæstiréttur'

    const [goproResponse, supremeCourtResponse] = await Promise.allSettled([
      !onlyFetchSupremeCourtVerdicts
        ? this.goproApi.getVerdicts({
            requestData: {
              orderBy: 'verdictDate desc',
              itemsPerPage: ITEMS_PER_PAGE,
              pageNumber: input.pageNumber,
              searchTerm: input.searchTerm,
              courtLevel: input.courtLevel,
            },
          })
        : { status: 'rejected', items: [], total: 0 },
      !input.courtLevel || onlyFetchSupremeCourtVerdicts
        ? this.supremeCourtApi.apiV2VerdictGetVerdictsPost({
            verdictSearchRequest: {
              page: input.pageNumber,
              limit: ITEMS_PER_PAGE,
              orderBy: 'publishDate DESC',
              searchTerm: input.searchTerm,
            },
          })
        : { status: 'rejected', items: [], total: 0 },
    ])

    const items: {
      id: string
      title: string
      court: string
      caseNumber: string
      verdictDate?: Date | null
      presidentJudge?: { name?: string; title?: string }
      keywords: string[]
      presentings: string
    }[] = []

    if (goproResponse.status === 'fulfilled') {
      for (const goproItem of goproResponse.value.items ?? []) {
        items.push({
          id: goproItem.id ? `${GOPRO_ID_PREFIX}${goproItem.id}` : '',
          title: goproItem.title ?? '',
          court: goproItem.court ?? '',
          caseNumber: goproItem.caseNumber ?? '',
          verdictDate: goproItem.verdictDate,
          presidentJudge: goproItem.judges?.find((judge) =>
            Boolean(judge?.isPresident),
          ),
          keywords: goproItem.keywords ?? [],
          presentings: goproItem.presentings ?? '',
        })
      }
    }

    if (supremeCourtResponse.status === 'fulfilled') {
      for (const supremeCourtItem of supremeCourtResponse.value.items ?? []) {
        items.push({
          id: supremeCourtItem.id
            ? `${SUPREME_COURT_ID_PREFIX}${supremeCourtItem.id}`
            : '',
          title: supremeCourtItem.title ?? '',
          court: supremeCourtItem.court ?? '',
          caseNumber: supremeCourtItem.caseNumber ?? '',
          verdictDate: supremeCourtItem.publishDate,
          presidentJudge: supremeCourtItem.judges?.find((judge) =>
            Boolean(judge?.isPresident),
          ),
          keywords: supremeCourtItem.keywords ?? [],
          presentings: '',
        })
      }
    }

    items.sort((a, b) => {
      if (!a.verdictDate && !b.verdictDate) return 0
      if (!b.verdictDate) return -1
      if (!a.verdictDate) return 1
      return (
        new Date(b.verdictDate).getTime() - new Date(a.verdictDate).getTime()
      )
    })

    return {
      total:
        Number(
          supremeCourtResponse.status === 'fulfilled'
            ? supremeCourtResponse.value.total ?? 0
            : 0,
        ) +
        Number(
          goproResponse.status === 'fulfilled'
            ? goproResponse.value.total ?? 0
            : 0,
        ),
      items,
    }
  }

  async getSingleVerdictById(id: string) {
    if (id.startsWith(GOPRO_ID_PREFIX)) {
      const response = await this.goproApi.getVerdict({
        id: id.slice(GOPRO_ID_PREFIX.length),
      })
      if (response.item?.docContent)
        return {
          item: {
            pdfString: response.item.docContent,
            title: response.item.title ?? '',
            court: response.item.court ?? '',
            verdictDate: response.item.verdictDate,
            caseNumber: response.item.caseNumber ?? '',
            keywords: response.item.keywords ?? [],
            presentings: response.item.presentings ?? '',
          },
        }
    } else if (id.startsWith(SUPREME_COURT_ID_PREFIX)) {
      const response = await this.supremeCourtApi.apiV2VerdictIdGet({
        id: id.slice(SUPREME_COURT_ID_PREFIX.length),
      })
      if (response.item?.verdictHtml)
        return {
          item: {
            richText: await convertHtmlToContentfulRichText(
              response.item.verdictHtml,
              'verdictHtml',
            ),
            title: response.item.title ?? '',
            court: response.item.court ?? '',
            verdictDate: response.item.publishDate,
            caseNumber: response.item.caseNumber ?? '',
            keywords: response.item.keywords ?? [],
            presentings: response.item.presentings ?? '',
          },
        }
    }

    return null
  }

  async getCaseTypes() {
    return {
      caseTypes: [],
    }
  }

  async getCaseCategories() {
    return {
      caseCategories: [],
    }
  }

  async getKeywords() {
    return {
      keywords: [],
    }
  }
}
