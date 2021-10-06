import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IOrganizationSubpage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapOrganizationSubpage } from '../../models/organizationSubpage.model'
import { extractStringsFromObject } from './utils'

@Injectable()
export class OrganizationSubpageSyncService
  implements CmsSyncProvider<IOrganizationSubpage> {
  processSyncData(entries: processSyncDataInput<IOrganizationSubpage>) {
    return entries.filter(
      (entry: Entry<any>): entry is IOrganizationSubpage =>
        entry.sys.contentType.sys.id === 'organizationSubpage' &&
        !!entry.fields.title,
    )
  }

  doMapping(entries: IOrganizationSubpage[]) {
    logger.info('Mapping organization subpage', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapOrganizationSubpage(entry)
          const content = extractStringsFromObject(mapped.description ?? [])
          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webOrganizationSubpage',
            response: JSON.stringify({
              ...mapped,
              typename: 'OrganizationSubpage',
            }),
            tags: [
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
              {
                key: entry.fields?.organizationPage.fields?.slug,
                type: 'organization',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import organization subpage', {
            error: error.message,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
