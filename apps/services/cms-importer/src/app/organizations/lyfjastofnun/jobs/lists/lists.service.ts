import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../../../../platform/cms.repository'
import {
  getExistingGenericListSlugs,
  getExistingLinkUrls,
  resolveAsset,
  resolveExternalLink,
  syncCreateOnly,
} from '../../../../platform/sync-strategies'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunScrapedItem } from '../../lyfjastofnun.types'
import { LYFJASTOFNUN_OWNER_TAG } from '../../lyfjastofnun.constants'
import {
  FILE_CONTENT_TYPE_MAP,
  GENERIC_LIST_ID,
  LINK_URL_CONTENT_TYPE,
} from './constants'
import { mapEntryCreationDto, mapSlug } from './lists.mapper'

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
    const existingLinkUrls = await getExistingLinkUrls(
      this.cmsRepository,
      LINK_URL_CONTENT_TYPE,
    )

    await syncCreateOnly<LyfjastofnunScrapedItem, Link>({
      cmsRepository: this.cmsRepository,
      contentType: 'genericListItem',
      logLabel: 'Lyfjastofnun lists import',
      publish,
      limit,
      getItems: () => this.lyfjastofnunRepository.getLists(),
      getExistingKeys: () =>
        getExistingGenericListSlugs(this.cmsRepository, GENERIC_LIST_ID),
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
      mapEntry: (item, link) => mapEntryCreationDto(item, GENERIC_LIST_ID, link),
    })
  }
}
