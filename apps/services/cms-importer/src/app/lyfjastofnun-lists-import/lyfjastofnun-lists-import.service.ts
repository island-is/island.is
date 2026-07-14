import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { LOCALE } from '../constants'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import { LyfjastofnunListsRepository } from '../repositories/lyfjastofnun-lists/lyfjastofnun-lists.repository'
import { LyfjastofnunListItem } from '../repositories/lyfjastofnun-lists/lyfjastofnun-lists.types'
import {
  FILE_CONTENT_TYPE_MAP,
  GENERIC_LIST_ID,
  LINK_URL_CONTENT_TYPE,
  OWNER_TAG,
} from './constants'
import { mapEntryCreationDto, mapSlug } from './mapper'

const guessFileContentType = (url: string): string => {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase()
  return FILE_CONTENT_TYPE_MAP[ext ?? ''] ?? 'application/octet-stream'
}

@Injectable()
export class LyfjastofnunListsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly listsRepository: LyfjastofnunListsRepository,
  ) {}

  async run({
    publish = false,
    limit,
  }: { publish?: boolean; limit?: number } = {}): Promise<void> {
    logger.info('Lyfjastofnun lists import starting...', { publish, limit })

    const items = await this.listsRepository.getItems()
    if (!items.length) {
      logger.warn('No Lyfjastofnun list items scraped, aborting')
      return
    }

    const existingSlugs = await this.getExistingSlugs()
    const existingLinkUrls = await this.getExistingLinkUrls()

    const newItems = items
      .filter((item) => {
        const slug = mapSlug(item)
        if (existingSlugs.has(slug)) {
          logger.info('Skipping item, slug already exists in Contentful', {
            slug,
          })
          return false
        }
        return true
      })
      .slice(0, limit ?? Infinity)

    if (!newItems.length) {
      logger.info('No new Lyfjastofnun list items to import')
      return
    }

    const dtos: EntryCreationDto[] = []
    let skipped = 0

    for (const item of newItems) {
      const dto = await this.buildEntry(item, existingLinkUrls, publish)
      if (dto) {
        dtos.push(dto)
      } else {
        skipped++
      }
    }

    const results = await this.cmsRepository.createEntries(
      dtos,
      'genericListItem',
    )
    const created = results.filter((r) => r.status === 'success').length
    const failed = results.filter((r) => r.status === 'error').length

    if (failed > 0) logger.warn('Some entries failed to create', { failed })
    logger.info('Lyfjastofnun lists import finished', {
      created,
      skipped,
      failed,
    })
  }

  private async getExistingSlugs(): Promise<Set<string>> {
    const entries = await this.cmsRepository.getGenericListItemEntries(
      GENERIC_LIST_ID,
    )
    const slugs = new Set<string>()

    for (const entry of entries) {
      const slug = entry.fields['slug']?.[LOCALE]
      if (slug) slugs.add(slug)
    }

    return slugs
  }

  private async getExistingLinkUrls(): Promise<Map<string, string>> {
    const entries = await this.cmsRepository.getContentByType(
      LINK_URL_CONTENT_TYPE,
    )
    const urls = new Map<string, string>()

    for (const entry of entries) {
      const url = entry.fields['url']?.[LOCALE]
      if (url) urls.set(url, entry.sys.id)
    }

    return urls
  }

  private async buildEntry(
    item: LyfjastofnunListItem,
    existingLinkUrls: Map<string, string>,
    publish: boolean,
  ): Promise<EntryCreationDto | undefined> {
    if (item.fileUrl) {
      const assetId = await this.resolveAsset(item.fileUrl, publish)
      if (!assetId) {
        logger.warn('Skipping item, could not upload asset', {
          title: item.title,
        })
        return undefined
      }
      return mapEntryCreationDto(item, GENERIC_LIST_ID, { assetId })
    }

    if (item.externalUrl) {
      const externalLinkId = await this.resolveExternalLink(
        item.externalUrl,
        existingLinkUrls,
      )
      if (!externalLinkId) {
        logger.warn('Skipping item, could not create external link entry', {
          title: item.title,
        })
        return undefined
      }
      return mapEntryCreationDto(item, GENERIC_LIST_ID, { externalLinkId })
    }

    logger.warn('Skipping item, no file or external link found', {
      title: item.title,
    })
    return undefined
  }

  private async resolveAsset(
    fileUrl: string,
    publish: boolean,
  ): Promise<string | null> {
    const fileName = fileUrl.split('/').pop()?.split('?')[0]
    if (!fileName) return null

    const existing = await this.cmsRepository.findAssetByFileName(fileName)
    if (existing) {
      logger.info('Asset already exists in Contentful, reusing', {
        fileName,
        assetId: existing.sys.id,
      })
      return existing.sys.id
    }

    const asset = await this.cmsRepository.createAsset(
      {
        metadata: {
          tags: [{ sys: { type: 'Link', linkType: 'Tag', id: OWNER_TAG } }],
        },
        fields: {
          title: { [LOCALE]: fileName },
          file: {
            [LOCALE]: {
              contentType: guessFileContentType(fileUrl),
              fileName,
              upload: fileUrl,
            },
          },
        },
      },
      publish,
    )

    if (!asset) {
      logger.warn('Failed to upload asset', { fileUrl })
      return null
    }

    return asset.sys.id
  }

  private async resolveExternalLink(
    url: string,
    existingLinkUrls: Map<string, string>,
  ): Promise<string | null> {
    const existingId = existingLinkUrls.get(url)
    if (existingId) return existingId

    const results = await this.cmsRepository.createEntries(
      [{ fields: { url: { [LOCALE]: url } } }],
      LINK_URL_CONTENT_TYPE,
    )

    const result = results[0]
    if (result?.status !== 'success') {
      logger.warn('Failed to create linkUrl entry', { url })
      return null
    }

    existingLinkUrls.set(url, result.entry.sys.id)
    return result.entry.sys.id
  }
}
