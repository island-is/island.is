import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IAnchorPage } from '../../generated/contentfulTypes'
import { mapAnchorPage } from '../../models/anchorPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class AnchorPageSyncService implements CmsSyncProvider<IAnchorPage> {
  processSyncData(entries: processSyncDataInput<IAnchorPage>) {
    logger.info('Processing sync data for anchor pages')

    // only process anchor pages that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is IAnchorPage =>
        entry.sys.contentType.sys.id === 'anchorPage' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: IAnchorPage[]) {
    logger.info('Mapping anchor pages', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAnchorPage(entry)
          const content = extractStringsFromObject(mapped.content)

          // TODO - this needs to be removed after successful migration
          let type = 'webLifeEventPage'

          if (entry.fields?.pageType === 'Digital Iceland Service') {
            type = 'webDigitalIcelandService'
          } else if (
            entry.fields?.pageType === 'Digital Iceland Community Page'
          ) {
            type = 'webDigitalIcelandCommunityPage'
          }

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type,
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
