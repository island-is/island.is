import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { ILifeEventPage } from '../../generated/contentfulTypes'
import { mapAnchorPage } from '../../models/anchorPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class LifeEventPageSyncService implements CmsSyncProvider<ILifeEventPage> {
  processSyncData(entries: processSyncDataInput<ILifeEventPage>) {
    logger.info('Processing sync data for anchor pages')

    // only process life event pages that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is ILifeEventPage =>
        entry.sys.contentType.sys.id === 'lifeEventPage' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: ILifeEventPage[]) {
    logger.info('Mapping life event pages', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAnchorPage(entry)
          const content = extractStringsFromObject(mapped.content)

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webLifeEventPage',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'AnchorPage' }),
            tags: [],
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
