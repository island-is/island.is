import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IOrganization } from '../../generated/contentfulTypes'
import { mapOrganization } from '../../models/organization.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

@Injectable()
export class OrganizationSyncService implements CmsSyncProvider<IOrganization> {
  processSyncData(entries: processSyncDataInput<IOrganization>) {
    logger.info('Processing sync data for organization')

    // only process organization that we consider not to be empty
    return entries.filter(
      (entry: Entry<any>): entry is IOrganization =>
        entry.sys.contentType.sys.id === 'organization' &&
        !!entry.fields.title &&
        !!entry.fields.slug,
    )
  }

  doMapping(entries: IOrganization[]) {
    logger.info('Mapping organization', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapOrganization(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in organization', {
              id: entry?.sys?.id,
            })
            return false
          }

          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webOrganization',
            response: JSON.stringify({ ...mapped, typename: 'Organization' }),
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
