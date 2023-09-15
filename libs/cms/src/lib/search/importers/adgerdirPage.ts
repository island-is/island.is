import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IVidspyrnaPage } from '../../generated/contentfulTypes'
import { mapAdgerdirPage } from '../../models/adgerdirPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

import {
  createTerms,
  extractStringsFromObject,
  numberOfProcessEntries,
  numberOfLinks,
} from './utils'

@Injectable()
export class AdgerdirPageSyncService
  implements CmsSyncProvider<IVidspyrnaPage>
{
  processSyncData(entries: processSyncDataInput<IVidspyrnaPage>) {
    // only process pages that we consider not to be empty and don't have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is IVidspyrnaPage =>
        entry.sys.contentType.sys.id === 'vidspyrnaPage' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: IVidspyrnaPage[]) {
    logger.info('Mapping adgerdir page', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAdgerdirPage(entry)
          const content = `${mapped.longDescription} ${extractStringsFromObject(
            { ...mapped.content },
          )}` // this function only accepts plain js objects
          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            processEntryCount: numberOfProcessEntries(mapped.content),
            ...numberOfLinks(mapped.content),
            type: 'webAdgerdirPage',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'AdgerdirPage' }),
            tags: [
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import adgerdir page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
