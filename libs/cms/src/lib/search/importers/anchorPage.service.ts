import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IAnchorPage } from '../../generated/contentfulTypes'
import { mapAnchorPage } from '../../models/anchorPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractChildEntryIds,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'

@Injectable()
export class AnchorPageSyncService implements CmsSyncProvider<IAnchorPage> {
  processSyncData(entries: processSyncDataInput<IAnchorPage>) {
    // only process anchor pages that we consider not to be empty and dont have circular structures
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IAnchorPage =>
        entry.sys.contentType.sys.id === 'anchorPage' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )

    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IAnchorPage[]) {
    if (entries.length > 0) {
      logger.info('Mapping anchor pages', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAnchorPage(entry)
          const content = extractStringsFromObject(
            mapped.content.map(pruneNonSearchableSliceUnionFields),
          )

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type:
              entry.fields?.pageType === 'Digital Iceland Community Page'
                ? 'webDigitalIcelandCommunityPage'
                : 'webDigitalIcelandService',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'AnchorPage' }),
            tags: childEntryIds.map((id) => ({
              key: id,
              type: 'hasChildEntryWithId',
            })),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import anchor page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
