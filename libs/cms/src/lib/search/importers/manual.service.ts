import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { IManual, IManualFields } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'
import { mapManual } from '../../models/manual.model'
import { extractChildEntryIds } from './utils'

export const isManual = (entry: Entry<IManualFields>): entry is IManual =>
  entry.sys.contentType.sys.id === 'manual' &&
  !!entry.fields.title &&
  !!entry.fields.slug

@Injectable()
export class ManualSyncService implements CmsSyncProvider<IManual> {
  processSyncData(entries: processSyncDataInput<IManual>) {
    // only process manuals that we consider not to be empty
    const entriesToUpdate = entries.filter(isManual)
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IManual[]) {
    if (entries.length > 0) {
      logger.info('Mapping manuals', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapManual(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in manual', {
              id: entry?.sys?.id,
            })
            return false
          }

          const content = extractStringsFromObject(
            (mapped.description ?? []).map(pruneNonSearchableSliceUnionFields),
          )

          const tags = [
            {
              key: mapped.slug,
              type: 'slug',
            },
          ]

          if (mapped.organization?.slug) {
            tags.push({
              key: mapped.organization.slug,
              type: 'organization',
            })
          }

          if (mapped.category?.slug) {
            tags.push({
              key: mapped.category.slug,
              type: 'category',
            })
          }
          if (mapped.group?.slug) {
            tags.push({
              key: mapped.group.slug,
              type: 'group',
            })
          }
          if (mapped.subgroup?.slug) {
            tags.push({
              key: mapped.subgroup.slug,
              type: 'subgroup',
            })
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
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webManual',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'Manual' }),
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import manual', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
