import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../../../../platform/cms.repository'
import {
  getExistingSlugsByLinkedEntry,
  syncCreateOnly,
} from '../../../../platform/sync-strategies'
import { makeTagMetadata } from '../../../../platform/localization'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { WpPost } from '../../lyfjastofnun.types'
import { extractFirstImageUrl, extractIntro } from '../../lyfjastofnun.utils'
import {
  LYFJASTOFNUN_ORG_ID,
  LYFJASTOFNUN_OWNER_TAG,
} from '../../lyfjastofnun.constants'
import { LOCALE } from '../../../../constants'
import { cleanImageTitle, guessImageContentType, pickSeedImage } from './utils'
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
  // fileName -> assetId, for images uploaded during the current run only.
  private readonly uploadedAssetIdsByFileName = new Map<string, string>()

  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly lyfjastofnunRepository: LyfjastofnunRepository,
  ) {}

  async run({
    publish,
    slug,
    months,
    limit,
  }: {
    publish?: boolean
    slug?: string
    months?: number
    limit?: number
  } = {}): Promise<void> {
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

        const assetId = await this.resolveImage(post, publish)

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

  /*
    Falls back to a seed image when the post has no image of its own, or when
    its inline image cannot be uploaded. Most lyfjastofnun.is posts carry no
    inline image, and `news` requires one, so without this the majority of a
    backfill would be skipped.
  */
  private async resolveImage(post: WpPost, publish: boolean): Promise<string> {
    const inlineUrl = extractFirstImageUrl(post.content?.rendered ?? '')

    if (inlineUrl) {
      const assetId = await this.uploadRemoteImage(
        inlineUrl,
        post.slug,
        publish,
      )
      if (assetId) return assetId
      logger.warn('Inline image failed, falling back to a seed image', {
        slug: post.slug,
      })
    }

    const seedAssetId = pickSeedImage(post.slug)
    logger.info('Using seed image', { slug: post.slug, assetId: seedAssetId })
    return seedAssetId
  }

  private async uploadRemoteImage(
    imageUrl: string,
    slug: string,
    publish: boolean,
  ): Promise<string | null> {
    const fileName = imageUrl.split('/').pop()?.split('?')[0] ?? `${slug}.jpg`
    const title = cleanImageTitle(fileName)

    /*
      Checked before `findAssetByFileName` because that query cannot see an
      asset this same run just created: `createAsset` kicks off
      `processForAllLocales` asynchronously, and `fields.file.fileName` is only
      queryable once processing completes. Without this cache, several posts
      sharing one image each upload their own copy — which is how the space
      ended up with four identical copies of one file after the first run.
    */
    const cached = this.uploadedAssetIdsByFileName.get(fileName)
    if (cached) {
      logger.info('Inline image already uploaded in this run, reusing', {
        slug,
        assetId: cached,
      })
      return cached
    }

    const existing = await this.cmsRepository.findAssetByFileName(fileName)
    if (existing) {
      logger.info('Inline image already exists in Contentful, reusing', {
        slug,
        assetId: existing.sys.id,
      })
      this.uploadedAssetIdsByFileName.set(fileName, existing.sys.id)
      return existing.sys.id
    }

    logger.info('Uploading inline image', { slug, imageUrl })

    const asset = await this.cmsRepository.createAsset(
      {
        metadata: makeTagMetadata(LYFJASTOFNUN_OWNER_TAG),
        fields: {
          title: { [LOCALE]: title },
          file: {
            [LOCALE]: {
              contentType: guessImageContentType(fileName),
              fileName,
              upload: imageUrl,
            },
          },
        },
      },
      publish,
    )

    if (!asset) {
      logger.warn('Failed to upload inline image', { slug })
      return null
    }

    logger.info('Inline image uploaded', { slug, assetId: asset.sys.id })
    this.uploadedAssetIdsByFileName.set(fileName, asset.sys.id)
    return asset.sys.id
  }
}
