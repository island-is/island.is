import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { LOCALE } from '../../../../constants'
import { CmsRepository } from '../../../../platform/cms.repository'
import {
  resolveAsset,
  resolveExternalLink,
  syncCreateOnly,
  toAssetFileName,
} from '../../../../platform/sync-strategies'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { LYFJASTOFNUN_OWNER_TAG } from '../../lyfjastofnun.constants'
import {
  FILE_CONTENT_TYPE_MAP,
  GENERIC_LIST_ID,
  LINK_URL_CONTENT_TYPE,
} from './constants'
import { mapEntryCreationDto, mapLegacySlug, mapSlug } from './lists.mapper'

interface Link {
  assetId?: string
  externalLinkId?: string
}

@Injectable()
export class LyfjastofnunListsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly lyfjastofnunRepository: LyfjastofnunRepository,
  ) {}

  async run({
    publish,
    limit,
  }: { publish?: boolean; limit?: number } = {}): Promise<void> {
    const existingLinkUrls = new Map<string, string>()
    const linkUrlsById = new Map<string, string>()
    const links = await this.cmsRepository.getContentByType(
      LINK_URL_CONTENT_TYPE,
    )
    for (const link of links) {
      const url = link.fields.url?.[LOCALE]
      if (url) {
        existingLinkUrls.set(url, link.sys.id)
        linkUrlsById.set(link.sys.id, url)
      }
    }

    await syncCreateOnly<LyfjastofnunScrapedItem, Link>({
      cmsRepository: this.cmsRepository,
      contentType: 'genericListItem',
      logLabel: 'Lyfjastofnun lists import',
      publish,
      limit,
      getItems: () => this.lyfjastofnunRepository.getLists(),
      getExistingKeys: (items) => this.getExistingKeys(items, linkUrlsById),
      keyOf: mapSlug,
      resolveLink: async (item, publish): Promise<Link | undefined> => {
        if (item.fileUrl) {
          const assetId = await resolveAsset(
            this.cmsRepository,
            item.fileUrl,
            LYFJASTOFNUN_OWNER_TAG,
            publish,
            FILE_CONTENT_TYPE_MAP,
          )
          if (!assetId) {
            logger.warn('Skipping item, could not upload asset', {
              title: item.title,
            })
            return undefined
          }
          return { assetId }
        }

        if (item.externalUrl) {
          const externalLinkId = await resolveExternalLink(
            this.cmsRepository,
            item.externalUrl,
            existingLinkUrls,
            LINK_URL_CONTENT_TYPE,
            publish,
          )
          if (!externalLinkId) {
            logger.warn('Skipping item, could not create external link entry', {
              title: item.title,
            })
            return undefined
          }
          return { externalLinkId }
        }

        logger.warn('Skipping item, no file or external link found', {
          title: item.title,
        })
        return undefined
      },
      mapEntry: (item, link) =>
        mapEntryCreationDto(item, GENERIC_LIST_ID, link),
    })
  }

  private async getExistingKeys(
    items: LyfjastofnunScrapedItem[],
    linkUrlsById: Map<string, string>,
  ): Promise<Set<string>> {
    const entries = await this.cmsRepository.getGenericListItemEntries(
      GENERIC_LIST_ID,
    )
    const keys = new Set<string>()
    const byLegacySlug = new Map<string, LyfjastofnunScrapedItem[]>()
    for (const item of items) {
      const slug = mapLegacySlug(item)
      const group = byLegacySlug.get(slug)
      if (group) group.push(item)
      else byLegacySlug.set(slug, [item])
    }

    for (const entry of entries) {
      const slug = entry.fields.slug?.[LOCALE]
      if (!slug) continue
      keys.add(slug)

      const candidates = byLegacySlug.get(slug)
      if (!candidates) continue
      const assetId = entry.fields.asset?.[LOCALE]?.sys?.id
      const linkId = entry.fields.externalLink?.[LOCALE]?.sys?.id
      const fileName = assetId
        ? await this.cmsRepository.getAssetFileName(assetId)
        : undefined
      const url = linkId ? linkUrlsById.get(linkId) : undefined
      const matches = new Set(
        candidates
          .filter((item) =>
            item.fileUrl
              ? !!fileName && toAssetFileName(item.fileUrl) === fileName
              : !!url && item.externalUrl === url,
          )
          .map(mapSlug),
      )

      if (matches.size === 1) {
        for (const key of matches) keys.add(key)
      } else {
        // Legacy entries do not store the source URL for assets. If the
        // filename or link cannot identify one item, avoid creating duplicates.
        logger.warn('Cannot match legacy Lyfjastofnun list item uniquely', {
          slug,
          entryId: entry.sys.id,
        })
        for (const item of candidates) keys.add(mapSlug(item))
      }
    }

    return keys
  }
}
