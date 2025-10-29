import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { ILink, IGenericListItem } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapGenericListItem } from '../../models/genericListItem.model'
import { extractChildEntryIds } from './utils'

@Injectable()
export class GenericListItemSyncService
  implements CmsSyncProvider<IGenericListItem>
{
  processSyncData(entries: processSyncDataInput<ILink>) {
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IGenericListItem =>
        entry.sys.contentType.sys.id === 'genericListItem' &&
        entry.fields.title,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IGenericListItem[]) {
    if (entries.length > 0) {
      logger.info('Mapping generic list items', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapGenericListItem(entry)

          const contentSections: string[] = []

          if (entry.fields.cardIntro) {
            contentSections.push(
              documentToPlainTextString(entry.fields.cardIntro),
            )
          }
          if (entry.fields.content) {
            contentSections.push(
              documentToPlainTextString(entry.fields.content),
            )
          }

          for (const tag of mapped.filterTags ?? []) {
            contentSections.push(tag.title)
          }

          const content = contentSections.join(' ')

          const tags: MappedData['tags'] =
            mapped.filterTags?.map((tag) => ({
              type: 'genericTag',
              key: tag.slug,
            })) ?? []

          if (mapped.genericList) {
            tags.push({
              type: 'referencedBy',
              key: mapped.genericList.id,
            })
          }
          if (mapped.slug) {
            tags.push({ type: 'slug', key: mapped.slug })
          }

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)
          for (const id of childEntryIds) {
            tags.push({
              key: id,
              type: 'hasChildEntryWithId',
            })
          }

          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webGenericListItem',
            content,
            contentWordCount: content.split(/\s+/).length,
            response: JSON.stringify({
              ...mapped,
              typename: 'GenericListItem',
            }),
            dateCreated:
              (entry.sys as { firstPublishedAt?: string }).firstPublishedAt ||
              entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
            tags,
            releaseDate: mapped.date,
          }
        } catch (error) {
          logger.warn('Failed to import generic list item', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
