import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { LOCALE } from '../constants'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import { RskTreatiesRepository } from '../repositories/rsk-treaties/rskTreaties.repository'
import {
  RskTreatyDocument,
  RskTreatyItem,
} from '../repositories/rsk-treaties/dto/rskTreaty.dto'
import { GENERIC_LIST_ID, TAB_KEY_DOCUMENT_TYPE_LABELS } from './constants'
import {
  ResolvedRskDocument,
  ResolvedRskLink,
  isSimpleShape,
  mapEntryCreationDto,
  mapSlug,
} from './mapper'

const FILE_CONTENT_TYPE_MAP: Record<string, string> = {
  pdf: 'application/pdf',
}

const guessFileContentType = (url: string): string => {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase()
  return FILE_CONTENT_TYPE_MAP[ext ?? ''] ?? 'application/pdf'
}

@Injectable()
export class RskTreatiesImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly treatiesRepository: RskTreatiesRepository,
  ) {}

  async run({ limit }: { limit?: number } = {}): Promise<void> {
    logger.info('RSK treaties import starting...')

    const items = await this.treatiesRepository.getTreatyItems()
    logger.info('RSK treaties scraped', { count: items.length })
    if (!items.length) {
      logger.warn('No RSK treaty items scraped, aborting')
      return
    }

    const existingSlugs = await this.getExistingSlugs()
    logger.info('Existing genericListItem slugs fetched', {
      count: existingSlugs.size,
    })

    const newItems = items
      .filter((item) => {
        const slug = mapSlug(item.name)[LOCALE]
        if (existingSlugs.has(slug)) {
          logger.info('Skipping item, slug already exists in Contentful', {
            slug,
          })
          return false
        }
        return true
      })
      .slice(0, limit ?? Infinity)

    logger.info('RSK treaties new items to process', {
      count: newItems.length,
    })

    if (!newItems.length) {
      logger.info('No new RSK treaty items to import')
      return
    }

    const dtos: EntryCreationDto[] = []
    let skipped = 0

    for (const [index, item] of newItems.entries()) {
      logger.info(
        `Processing item ${index + 1}/${newItems.length}: ${item.name}`,
        { documents: item.documents.length, tabKeys: item.tabKeys },
      )
      const dto = await this.buildEntry(item)
      if (dto) {
        dtos.push(dto)
      } else {
        skipped++
      }
    }

    logger.info('RSK treaties link resolution finished, creating entries...', {
      toCreate: dtos.length,
      skipped,
    })

    const results = await this.cmsRepository.createEntries(
      dtos,
      'genericListItem',
    )
    const created = results.filter((r) => r.status === 'success').length
    const failed = results.filter((r) => r.status === 'error').length
    const unknown = results.filter((r) => r.status === 'unknown').length

    if (failed > 0) logger.warn('Some entries failed to create', { failed })
    if (unknown > 0) {
      logger.warn('Some entries had an unknown result — check earlier logs', {
        unknown,
      })
    }
    logger.info('RSK treaties import finished', {
      created,
      skipped,
      failed,
      unknown,
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

  private async buildEntry(
    item: RskTreatyItem,
  ): Promise<EntryCreationDto | undefined> {
    const simple = isSimpleShape(item)

    const documents: ResolvedRskDocument[] = []
    for (const document of item.documents) {
      const resolvedDocument = await this.resolveDocument(item, document, simple)
      if (resolvedDocument) {
        documents.push(resolvedDocument)
      }
    }

    if (!documents.length) {
      logger.warn('Skipping item, no links could be resolved', {
        name: item.name,
      })
      return undefined
    }

    return mapEntryCreationDto({
      name: item.name,
      tabKeys: item.tabKeys,
      documents,
    })
  }

  private async resolveDocument(
    item: RskTreatyItem,
    document: RskTreatyDocument,
    simple: boolean,
  ): Promise<ResolvedRskDocument | undefined> {
    const links: ResolvedRskLink[] = []

    for (const link of document.links) {
      const resolvedLink = await this.resolveLink(item, document, link, simple)
      if (resolvedLink) {
        links.push(resolvedLink)
      }
    }

    if (!links.length) return undefined

    return { label: document.label, links }
  }

  private async resolveLink(
    item: RskTreatyItem,
    document: RskTreatyDocument,
    link: RskTreatyDocument['links'][number],
    simple: boolean,
  ): Promise<ResolvedRskLink | undefined> {
    logger.debug('Resolving link', {
      name: item.name,
      documentLabel: document.label,
      kind: link.kind,
      href: link.href,
    })

    const resolved = await this.treatiesRepository.resolveLink(link, {
      name: item.name,
      documentLabel: document.label,
      tabKey: document.tabKey,
    })

    logger.debug('Link resolved', {
      name: item.name,
      kind: link.kind,
      resolvedType: resolved.type,
      resolvedUrl: resolved.url,
    })

    if (resolved.type === 'asset') {
      const title = `${item.name}: ${[
        TAB_KEY_DOCUMENT_TYPE_LABELS[document.tabKey],
        document.label,
        `á ${link.label}`,
      ]
        .filter(Boolean)
        .join(' - ')}`
      const assetId = await this.resolveAsset(resolved.url, title)
      if (!assetId) {
        logger.warn('Skipping link, could not upload asset', {
          name: item.name,
          url: resolved.url,
        })
        return undefined
      }
      return { kind: link.kind, label: link.label, resolved: { type: 'asset', assetId } }
    }

    // resolved.type === 'hyperlink'
    if (!simple) {
      return {
        kind: link.kind,
        label: link.label,
        resolved: { type: 'hyperlink', url: resolved.url },
      }
    }

    const entry = await this.cmsRepository.findOrCreateLinkUrlEntry(
      resolved.url,
    )
    if (!entry) {
      logger.warn('Skipping link, could not create linkUrl entry', {
        name: item.name,
        url: resolved.url,
      })
      return undefined
    }
    return {
      kind: link.kind,
      label: link.label,
      resolved: { type: 'externalLinkEntry', entryId: entry.sys.id },
    }
  }

  private async resolveAsset(
    fileUrl: string,
    title: string,
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

    logger.info('Uploading asset to Contentful', { fileName, fileUrl, title })

    const asset = await this.cmsRepository.createAsset(
      {
        fields: {
          title: { [LOCALE]: title },
          file: {
            [LOCALE]: {
              contentType: guessFileContentType(fileUrl),
              fileName,
              upload: fileUrl,
            },
          },
        },
      },
      false,
    )

    if (!asset) {
      logger.warn('Failed to upload asset', { fileUrl })
      return null
    }

    return asset.sys.id
  }
}
