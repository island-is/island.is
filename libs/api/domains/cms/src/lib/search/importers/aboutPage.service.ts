import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { IPage } from '../../generated/contentfulTypes'
import { mapAboutPage } from '../../models/aboutPage.model'

import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class AboutPageSyncService {
  processSyncData(items) {
    return items.filter((item) => item.sys.contentType.sys.id === 'page')
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
            content: extractStringsFromObject(mapped.slices),
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
          logger.error('Failed to import about page', error)
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
