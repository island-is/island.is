import { Entry } from 'contentful-management'
import { isDefined } from '@island.is/shared/utils'
import { logger } from '@island.is/logging'
import { LOCALE } from '../constants'
import { CmsRepository } from './cms.repository'
import { ContentTypeOptions, EntryCreationDto, EntryUpdateDto } from './cms.types'

// ── create-only-with-resolution ─────────────────────────────────────────────
// Used by jobs that dedupe against existing entries by a stable key, resolve
// an asset/link/image before mapping (the resolved id is a mapper input), and
// only ever create — never update. (lyfjastofnun-instructions, -lists, -news)

export interface SyncCreateOnlyConfig<Item, Link> {
  cmsRepository: CmsRepository
  contentType: ContentTypeOptions
  logLabel: string
  getItems: () => Promise<Item[]>
  getExistingKeys: () => Promise<Set<string>>
  keyOf: (item: Item) => string
  resolveLink: (item: Item, publish: boolean) => Promise<Link | undefined>
  mapEntry: (item: Item, link: Link) => EntryCreationDto | undefined
  publish?: boolean
  limit?: number
}

export const syncCreateOnly = async <Item, Link>({
  cmsRepository,
  contentType,
  logLabel,
  getItems,
  getExistingKeys,
  keyOf,
  resolveLink,
  mapEntry,
  publish = false,
  limit,
}: SyncCreateOnlyConfig<Item, Link>): Promise<void> => {
  logger.info(`${logLabel} starting...`, { publish, limit })

  const items = await getItems()
  if (!items.length) {
    logger.warn(`${logLabel}: no items fetched, aborting`)
    return
  }

  const existingKeys = await getExistingKeys()

  const newItems = items
    .filter((item) => {
      const key = keyOf(item)
      if (existingKeys.has(key)) {
        logger.info(`${logLabel}: skipping item, already exists`, { key })
        return false
      }
      return true
    })
    .slice(0, limit ?? Infinity)

  if (!newItems.length) {
    logger.info(`${logLabel}: no new items to import`)
    return
  }

  const dtos: EntryCreationDto[] = []
  let skipped = 0

  for (const item of newItems) {
    const link = await resolveLink(item, publish)
    if (link === undefined) {
      skipped++
      continue
    }

    const dto = mapEntry(item, link)
    if (dto) {
      dtos.push(dto)
    } else {
      skipped++
    }
  }

  const results = await cmsRepository.createEntries(dtos, contentType, publish)
  const created = results.filter((r) => r.status === 'success').length
  const failed = results.filter((r) => r.status === 'error').length

  if (failed > 0) {
    logger.warn(`${logLabel}: some entries failed to create`, { failed })
  }
  logger.info(`${logLabel} finished`, { created, skipped, failed })
}

// ── Shared resolution helpers for the genericListItem "file or external
// link" shape (lyfjastofnun-instructions, -lists) ───────────────────────────

export const guessFileContentType = (
  url: string,
  fileContentTypeMap: Record<string, string>,
): string => {
  const ext = url.split('.').pop()?.split('?')[0]?.toLowerCase()
  return fileContentTypeMap[ext ?? ''] ?? 'application/octet-stream'
}

export const getExistingGenericListSlugs = async (
  cmsRepository: CmsRepository,
  genericListId: string,
): Promise<Set<string>> => {
  const entries = await cmsRepository.getGenericListItemEntries(genericListId)
  const slugs = new Set<string>()

  for (const entry of entries) {
    const slug = entry.fields['slug']?.[LOCALE]
    if (slug) slugs.add(slug)
  }

  return slugs
}

export const getExistingSlugsByLinkedEntry = async (
  cmsRepository: CmsRepository,
  contentType: string,
  linkedEntryId: string,
): Promise<Set<string>> => {
  const entries = await cmsRepository.getContentByTypeAndLinkedEntry(
    contentType,
    linkedEntryId,
  )
  const slugs = new Set<string>()

  for (const entry of entries) {
    const slug = entry.fields['slug']?.[LOCALE]
    if (slug) slugs.add(slug)
  }

  return slugs
}

export const getExistingLinkUrls = async (
  cmsRepository: CmsRepository,
  linkUrlContentType: string,
): Promise<Map<string, string>> => {
  const entries = await cmsRepository.getContentByType(linkUrlContentType)
  const urls = new Map<string, string>()

  for (const entry of entries) {
    const url = entry.fields['url']?.[LOCALE]
    if (url) urls.set(url, entry.sys.id)
  }

  return urls
}

export const resolveAsset = async (
  cmsRepository: CmsRepository,
  fileUrl: string,
  ownerTag: string,
  publish: boolean,
  fileContentTypeMap: Record<string, string>,
): Promise<string | null> => {
  const fileName = fileUrl.split('/').pop()?.split('?')[0]
  if (!fileName) return null

  const existing = await cmsRepository.findAssetByFileName(fileName)
  if (existing) {
    logger.info('Asset already exists in Contentful, reusing', {
      fileName,
      assetId: existing.sys.id,
    })
    return existing.sys.id
  }

  const asset = await cmsRepository.createAsset(
    {
      metadata: {
        tags: [{ sys: { type: 'Link', linkType: 'Tag', id: ownerTag } }],
      },
      fields: {
        title: { [LOCALE]: fileName },
        file: {
          [LOCALE]: {
            contentType: guessFileContentType(fileUrl, fileContentTypeMap),
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

export const resolveExternalLink = async (
  cmsRepository: CmsRepository,
  url: string,
  existingLinkUrls: Map<string, string>,
  linkUrlContentType: ContentTypeOptions,
): Promise<string | null> => {
  const existingId = existingLinkUrls.get(url)
  if (existingId) return existingId

  const results = await cmsRepository.createEntries(
    [{ fields: { url: { [LOCALE]: url } } }],
    linkUrlContentType,
  )

  const result = results[0]
  if (result?.status !== 'success') {
    logger.warn('Failed to create linkUrl entry', { url })
    return null
  }

  existingLinkUrls.set(url, result.entry.sys.id)
  return result.entry.sys.id
}

// ── create-and-reconcile ────────────────────────────────────────────────────
// Used by jobs that create missing entries AND update every entry that
// already matches, on every run. No asset/link resolution step.
// (energy-fund-import, fsre-buildings-import)
//
// Create-dedupe and update-match can use different keys/fields (they do for
// fsre-buildings: slug for create-dedupe, internalTitle for update-match) so
// both are independently configurable rather than assumed to be the same.

export interface SyncCreateAndReconcileConfig<Item> {
  cmsRepository: CmsRepository
  genericListId: string
  logLabel: string
  getItems: () => Promise<Item[] | null>
  getCreateDedupeKey: (item: Item) => string
  getExistingCreateKey: (entry: Entry) => string | undefined
  mapCreateEntry: (item: Item) => EntryCreationDto | undefined
  getUpdateMatchKey: (item: Item) => string
  getExistingUpdateKey: (entry: Entry) => string | undefined
  mapUpdateEntry: (existingEntry: Entry, item: Item) => EntryUpdateDto | undefined
  onlyUpdateDraft?: boolean
}

export const syncCreateAndReconcile = async <Item>(
  config: SyncCreateAndReconcileConfig<Item>,
): Promise<void> => {
  const { cmsRepository, genericListId, logLabel, getItems } = config

  logger.info(`${logLabel} starting...`)

  const items = await getItems()
  if (!items || !items.length) {
    logger.warn(`${logLabel}: no items to process`)
    return
  }

  await reconcileUpdates(cmsRepository, genericListId, logLabel, items, config)
  await reconcileCreates(cmsRepository, genericListId, logLabel, items, config)

  logger.info(`${logLabel} finished`)
}

const reconcileCreates = async <Item>(
  cmsRepository: CmsRepository,
  genericListId: string,
  logLabel: string,
  items: Item[],
  {
    getCreateDedupeKey,
    getExistingCreateKey,
    mapCreateEntry,
  }: SyncCreateAndReconcileConfig<Item>,
): Promise<void> => {
  const existingEntries = await cmsRepository.getGenericListItemEntries(
    genericListId,
  )
  const existingKeys = new Set(
    existingEntries.map(getExistingCreateKey).filter(isDefined),
  )

  const seen = new Set<string>()
  const newEntries: EntryCreationDto[] = []

  for (const item of items) {
    const key = getCreateDedupeKey(item)

    if (seen.has(key)) {
      logger.info(`${logLabel}: duplicate item in source data, skipping`, {
        key,
      })
      continue
    }
    seen.add(key)

    if (existingKeys.has(key)) {
      logger.info(`${logLabel}: entry already exists, skipping`, { key })
      continue
    }

    const dto = mapCreateEntry(item)
    if (dto) newEntries.push(dto)
  }

  logger.info(`${logLabel}: creating entries...`)
  if (!newEntries.length) {
    logger.warn(`${logLabel}: no entries to create`)
    return
  }

  await cmsRepository.createEntries(newEntries, 'genericListItem')
  logger.info(`${logLabel}: entries creation finished`)
}

const reconcileUpdates = async <Item>(
  cmsRepository: CmsRepository,
  genericListId: string,
  logLabel: string,
  items: Item[],
  {
    getUpdateMatchKey,
    getExistingUpdateKey,
    mapUpdateEntry,
    onlyUpdateDraft = false,
  }: SyncCreateAndReconcileConfig<Item>,
): Promise<void> => {
  let existingEntries = await cmsRepository.getGenericListItemEntries(
    genericListId,
  )

  if (onlyUpdateDraft) {
    existingEntries = existingEntries.filter((entry) => entry.isDraft())
  }

  const entriesToUpdate = items
    .map((item) => {
      const key = getUpdateMatchKey(item)
      const matchingEntry = existingEntries.find(
        (entry) => getExistingUpdateKey(entry) === key,
      )
      return matchingEntry ? mapUpdateEntry(matchingEntry, item) : undefined
    })
    .filter(isDefined)

  logger.info(`${logLabel}: updating entries...`)
  if (!entriesToUpdate.length) {
    logger.warn(`${logLabel}: no entries to update`)
    return
  }

  await cmsRepository.updateEntries(entriesToUpdate, 'genericListItem', false)
  logger.info(`${logLabel}: entries update finished`)
}
