import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import {
  IManualChapter,
  IManualChapterFields,
} from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'
import { mapManualChapter } from '../../models/manualChapter.model'

@Injectable()
export class ManualChapterSyncService
  implements CmsSyncProvider<IManualChapter>
{
  processSyncData(entries: processSyncDataInput<IManualChapter>) {
    logger.info('Processing sync data for manual chapters')

    // only process manual chapters that we consider not to be empty
    return entries.filter(
      (entry: Entry<IManualChapterFields>): entry is IManualChapter =>
        entry.sys.contentType.sys.id === 'manualChapter' &&
        !!entry.fields.title,
    )
  }

  doMapping(entries: IManualChapter[]) {
    logger.info('Mapping manual chapters', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapManualChapter(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in manual chapter', {
              id: entry?.sys?.id,
            })
            return false
          }

          // TODO: what is searchable, should the content inside the items be searchable?
          const content = extractStringsFromObject(mapped.description)

          const tags = [
            {
              key: mapped.slug,
              type: 'slug',
            },
          ]

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webManualChapter',
            termPool: createTerms([mapped.title]), // TODO: test out what this does exactly
            response: JSON.stringify({ ...mapped, typename: 'ManualChapter' }),
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import manual chapter', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
