import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IOrganization } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapOrganization } from '../../models/organization.model'

@Injectable()
export class OrganizationSyncService implements CmsSyncProvider<IOrganization> {
  processSyncData(entries: processSyncDataInput<IOrganization>) {
    return entries.filter(
      (entry: Entry<any>): entry is IOrganization =>
        entry.sys.contentType.sys.id === 'organization' && !!entry.fields.title,
    )
  }

  doMapping(entries: IOrganization[]) {
    logger.info('Mapping organization', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapOrganization(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webOrganization',
            response: JSON.stringify({
              ...mapped,
              typename: 'Organization',
            }),
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
          logger.warn('Failed to import organization', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
