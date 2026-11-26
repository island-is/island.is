import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../../../../platform/cms.repository'
import {
  getExistingSlugsByLinkedEntry,
  syncCreateOnly,
} from '../../../../platform/sync-strategies'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { WpPost } from '../../lyfjastofnun.types'
import { extractIntro } from '../../lyfjastofnun.utils'
import { LYFJASTOFNUN_ORG_ID } from '../../lyfjastofnun.constants'
import { buildNewsEntry } from './news.mapper'
import {
  IMPORT_LIMIT,
  IMPORT_MONTHS_BACK,
  NEWS_CONTENT_TYPE,
} from './constants'

interface Link {
  assetId: string
  summary?: string | null
}

@Injectable()
export class LyfjastofnunNewsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly lyfjastofnunRepository: LyfjastofnunRepository,
  ) {}

  async run({
    imageAssetIdsBySlug,
    publish,
    slug,
    months,
    limit,
  }: {
    imageAssetIdsBySlug: Record<string, string>
    publish?: boolean
    slug?: string
    months?: number
    limit?: number
  }): Promise<void> {
    const monthsBack = months ?? IMPORT_MONTHS_BACK
    const postLimit = limit ?? IMPORT_LIMIT
    logger.info('Lyfjastofnun news import parameters', {
      monthsBack,
      postLimit,
      slug,
      publish,
    })

    await syncCreateOnly<WpPost, Link>({
      cmsRepository: this.cmsRepository,
      contentType: NEWS_CONTENT_TYPE,
      logLabel: 'Lyfjastofnun news import',
      publish,
      /*
        `limit` is handed to syncCreateOnly rather than applied here, so it
        slices *after* existing entries are filtered out — matching the
        instructions/lists/forms jobs. Applying it here would spend the whole
        budget on the newest posts every run, so anything skipped earlier (or
        older than the newest N) could never be picked up incrementally.
        An explicit `--slug` targets one post, so it ignores the limit.
      */
      limit: slug ? undefined : postLimit,
      getItems: async () => {
        const posts = await this.lyfjastofnunRepository.getPosts(monthsBack)
        return slug ? posts.filter((p) => p.slug === slug) : posts
      },
      getExistingKeys: () =>
        getExistingSlugsByLinkedEntry(
          this.cmsRepository,
          NEWS_CONTENT_TYPE,
          LYFJASTOFNUN_ORG_ID,
        ),
      keyOf: (post) => post.slug,
      resolveLink: async (post, publish): Promise<Link | undefined> => {
        if (!extractIntro(post)) {
          logger.warn('Skipping post, no intro or content available', {
            slug: post.slug,
          })
          return undefined
        }

        const assetId = imageAssetIdsBySlug[post.slug]?.trim()
        if (!assetId) {
          throw new Error(
            `Missing image asset assignment for news post: ${post.slug}`,
          )
        }
        await this.cmsRepository.requireImageAsset(assetId, publish)

        const summary = await this.lyfjastofnunRepository.scrapePostSummary(
          post.link,
        )
        if (summary) logger.info('Scraped post summary', { slug: post.slug })

        return { assetId, summary }
      },
      mapEntry: (post, link) =>
        buildNewsEntry(post, link.assetId, link.summary),
    })
  }
}
