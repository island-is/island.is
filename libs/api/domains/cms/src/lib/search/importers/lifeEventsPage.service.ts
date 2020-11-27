import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { ILifeEventPage } from '../../generated/contentfulTypes'
import { mapLifeEventPage } from '../../models/lifeEventPage.model'
import {
  CmsSyncProvider,
  doMappingInput,
  processSyncDataInput,
} from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class LifeEventsPageSyncService
  implements CmsSyncProvider<ILifeEventPage> {
  processSyncData(entries: processSyncDataInput<ILifeEventPage>) {
    logger.info('Processing sync data for life event pages')

    // only process life events that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is ILifeEventPage =>
        entry.sys.contentType.sys.id === 'lifeEventPage' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: doMappingInput<ILifeEventPage>) {
    logger.info('Mapping life event pages', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapLifeEventPage(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            content: extractStringsFromObject(mapped.content),
            type: 'webLifeEventPage',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'LifeEventPage' }),
            tags: [],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import life event page', {
            error: error.message,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
