import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IGrant } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractChildEntryIds } from './utils'
import { mapGrant } from '../../models/grant.model'

@Injectable()
export class GrantsSyncService implements CmsSyncProvider<IGrant> {
  processSyncData(entries: processSyncDataInput<IGrant>) {
    logger.debug('entires', entries)
    // only process grants that we consider not to be empty and dont have circular structures
    return entries.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (entry: Entry<any>): entry is IGrant =>
        entry.sys.contentType.sys.id === 'grant' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: IGrant[]) {
    if (entries.length > 0) {
      logger.info('Mapping grants', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapGrant(entry)
          const content = mapped.description ?? ''

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          return {
            _id: mapped.id,
            title: mapped.name,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webGrant',
            termPool: createTerms([mapped.name]),
            response: JSON.stringify({ ...mapped, typename: 'LifeEventPage' }),
            tags: childEntryIds.map((id) => ({
              key: id,
              type: 'hasChildEntryWithId',
            })),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import grant', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
