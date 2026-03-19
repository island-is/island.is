import { Injectable } from '@nestjs/common'
import type { SitemapUrl, SitemapUrlFetcher } from '../../../web-sitemap/utils'
import { ManagementClientService } from '../../cms/managementClient/managementClient.service'
import { EN_LOCALE, LOCALE } from '../../../constants'

@Injectable()
export class ManualRepository implements SitemapUrlFetcher {
  constructor(private readonly managementClient: ManagementClientService) {}

  async getSitemapUrls(
    itemsPerPage: number,
    pageIndex: number,
  ): Promise<{ urls: SitemapUrl[]; nextPageIndex: number }> {
    const manualResponse = await this.managementClient.getEntries({
      content_type: 'manual',
      limit: itemsPerPage,
      skip: pageIndex * itemsPerPage,
      select: 'fields.slug,fields.title,sys,fields.chapters',
      'sys.publishedAt[exists]': true,
    })
    if (!manualResponse.ok) throw manualResponse.error

    const manualChapterIds: string[] = []
    for (const manual of manualResponse.data.items)
      for (const chapter of manual.fields.chapters?.[LOCALE] ?? [])
        if (chapter?.sys?.id) manualChapterIds.push(chapter.sys.id)

    const manualChapterMap = new Map<
      string,
      {
        slug: { [LOCALE]: string; [EN_LOCALE]: string }
        title: { [LOCALE]: string; [EN_LOCALE]: string }
      }
    >()
    while (manualChapterIds.length > 0) {
      const ids = manualChapterIds.splice(0, 10)
      const manualChapterResponse = await this.managementClient.getEntries({
        content_type: 'manualChapter',
        select: 'fields.slug,fields.title,sys',
        'sys.id[in]': ids.join(','),
        'sys.publishedAt[exists]': true,
      })
      if (!manualChapterResponse.ok) throw manualChapterResponse.error
      for (const manualChapter of manualChapterResponse.data.items)
        manualChapterMap.set(manualChapter.sys.id, {
          slug: manualChapter.fields.slug,
          title: manualChapter.fields.title,
        })
    }

    const urls: SitemapUrl[] = []
    for (const manual of manualResponse.data.items) {
      const slug = manual.fields.slug?.[LOCALE]
      const enSlug = manual.fields.slug?.[EN_LOCALE]
      if (!slug && !enSlug) continue
      urls.push({
        loc: {
          [LOCALE]:
            slug && manual.fields.title?.[LOCALE]
              ? `https://island.is/handbaekur/${slug}`
              : '',
          [EN_LOCALE]:
            enSlug && manual.fields.title?.[EN_LOCALE]
              ? `https://island.is/en/manuals/${enSlug}`
              : '',
        },
        lastmod: manual.sys.publishedAt ?? null,
      })

      for (const chapter of manual.fields.chapters?.[LOCALE] ?? []) {
        const manualChapter = manualChapterMap.get(chapter.sys.id)
        if (!manualChapter) continue
        const chapterSlug = manualChapter.slug?.[LOCALE]
        const chapterEnSlug = manualChapter.slug?.[EN_LOCALE]
        if (!chapterSlug && !chapterEnSlug) continue
        urls.push({
          loc: {
            [LOCALE]:
              slug && chapterSlug && manualChapter.title?.[LOCALE]
                ? `https://island.is/handbaekur/${slug}/${chapterSlug}`
                : '',
            [EN_LOCALE]:
              enSlug && chapterEnSlug && manualChapter.title?.[EN_LOCALE]
                ? `https://island.is/en/manuals/${enSlug}/${chapterEnSlug}`
                : '',
          },
          lastmod: chapter.sys.publishedAt ?? null,
        })
      }
    }

    return {
      urls,
      nextPageIndex:
        manualResponse.data.total > (pageIndex + 1) * itemsPerPage
          ? pageIndex + 1
          : -1,
    }
  }
}
