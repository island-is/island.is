import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IPage } from '../../generated/contentfulTypes'
import { mapAboutPage } from '../../models/aboutPage.model'
import {
  CmsSyncProvider,
  doMappingInput,
  processSyncDataInput,
} from '../cmsSync.service'

import {
  createTerms,
  extractStringsFromObject,
  hasProcessEntry,
  numberOfLinks,
} from './utils'

@Injectable()
export class AboutPageSyncService implements CmsSyncProvider<IPage> {
  processSyncData(entries: processSyncDataInput<IPage>) {
    // only process pages that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is IPage =>
        entry.sys.contentType.sys.id === 'page' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: doMappingInput<IPage>) {
    logger.info('Mapping about page', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAboutPage(entry)
          const content = extractStringsFromObject({ ...mapped.slices }) // this function only accepts plain js objects
          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            hasProcessEntry: hasProcessEntry(mapped.slices),
            ...numberOfLinks(mapped.slices),
            type: 'webAboutPage',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'AboutPage' }),
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
          logger.warn('Failed to import about page', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
