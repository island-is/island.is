import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IPage } from '../../generated/contentfulTypes'
import { mapAboutPage } from '../../models/aboutPage.model'
import { CmsSyncProvider } from '../cmsSync.service'

import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class AboutPageSyncService implements CmsSyncProvider<IPage> {
  processSyncData(entries: (Entry<any> | IPage)[]) {
    // only process pages that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is IPage =>
        entry.sys.contentType.sys.id === 'page' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: IPage[]): MappedData[] {
    logger.info('Mapping about page', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAboutPage(entry)
          const type = 'webAboutPage'
          return {
            _id: mapped.id,
            title: mapped.title,
            content: extractStringsFromObject({ ...mapped.slices }), // this function only accepts plain js objects
            type,
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, __typename: type }),
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
