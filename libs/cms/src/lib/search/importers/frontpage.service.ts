import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IFrontpage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapFrontpage } from '../../models/frontpage.model'

@Injectable()
export class FrontpageSyncService implements CmsSyncProvider<IFrontpage> {
  processSyncData(entries: processSyncDataInput<IFrontpage>) {
    return entries
      .filter(
        (entry: Entry<any>): entry is IFrontpage =>
          entry.sys.contentType.sys.id === 'frontpage',
        // Avoids recursive deep linking from references in slide links
        // by limiting imports to only required fields
      )
      .map((entry) => {
        if (entry.fields?.slides) {
          entry.fields.slides = entry.fields.slides.map((slide) => {
            if (slide.fields?.link?.fields) {
              slide.fields.link.fields = {
                slug: slide.fields.link.fields.slug,
                title: slide.fields.link.fields.title,
              }
            }
            return slide
          })
        }
        return entry
      })
  }

  doMapping(entries: IFrontpage[]) {
    logger.info('Mapping frontpage', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapFrontpage(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webFrontpage',
            response: JSON.stringify({ ...mapped, typename: 'Frontpage' }),
            tags: [
              {
                key: entry.fields?.pageIdentifier,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import frontpage', {
            error: error.message,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
