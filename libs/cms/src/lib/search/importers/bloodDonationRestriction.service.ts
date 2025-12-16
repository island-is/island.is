import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { MappedData } from '@island.is/content-search-indexer/types'
import { IBloodDonationRestriction } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'
import { mapBloodDonationRestrictionListItem } from '../../models/bloodDonationRestriction.model'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

@Injectable()
export class BloodDonationRestrictionSyncService
  implements CmsSyncProvider<IBloodDonationRestriction>
{
  processSyncData(entries: processSyncDataInput<IBloodDonationRestriction>) {
    const entriesToUpdate: IBloodDonationRestriction[] = []
    const entriesToDelete: string[] = []
    for (const entry of entries) {
      if (entry.sys.contentType.sys.id !== 'bloodDonationRestriction') continue

      if (entry.fields.title?.trim()) {
        entriesToUpdate.push(entry as IBloodDonationRestriction)
      } else {
        entriesToDelete.push(entry.sys.id)
      }
    }
    return { entriesToUpdate, entriesToDelete }
  }

  doMapping(entries: IBloodDonationRestriction[]) {
    if (entries.length > 0) {
      logger.info('Mapping blood donation restrictions', {
        count: entries.length,
      })
    }
    const restrictionEntries = entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapBloodDonationRestrictionListItem(entry)
          if (isCircular(mapped)) {
            logger.warn(
              'Circular reference found in blood donation restriction',
              {
                id: entry.sys.id,
              },
            )
            return false
          }

          const tags = []

          for (const tag of entry.fields.filterTags ?? []) {
            tags.push({
              value: tag.fields.title,
              key: tag.fields.slug,
              type: 'genericTag',
            })
          }

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)
          for (const id of childEntryIds) {
            tags.push({
              value: id,
              key: id,
              type: 'hasChildEntryWithId',
            })
          }

          const contentSections = []

          if (mapped.description) {
            contentSections.push(mapped.description)
          }
          if (mapped.keywordsText) {
            contentSections.push(mapped.keywordsText)
          }
          if (entry.fields.cardText) {
            contentSections.push(
              documentToPlainTextString(entry.fields.cardText),
            )
          }

          const content = contentSections.join(' ')

          return {
            _id: mapped.id,
            title: (entry.fields.title || '').trim(),
            content,
            contentWordCount: content.split(' ').length,
            type: 'webBloodDonationRestriction',
            response: JSON.stringify(mapped),
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import blood donation restriction', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))

    return restrictionEntries
  }
}
