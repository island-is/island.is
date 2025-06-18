import { Entry } from 'contentful'
import { Injectable } from '@nestjs/common'
import isCircular from 'is-circular'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { mapOrganizationSubpage } from '../../models/organizationSubpage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { IOrganizationSubpage } from '../../generated/contentfulTypes'
import {
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
  extractChildEntryIds,
} from './utils'

@Injectable()
export class OrganizationSubpageSyncService
  implements CmsSyncProvider<IOrganizationSubpage>
{
  processSyncData(entries: processSyncDataInput<IOrganizationSubpage>) {
    return entries.filter(
      (entry: Entry<any>): entry is IOrganizationSubpage =>
        entry.sys.contentType.sys.id === 'organizationSubpage' &&
        !!entry.fields.title &&
        !!entry.fields.slug &&
        !!entry.fields.organizationPage?.fields?.slug &&
        // Standalone organization pages have their own search, we don't want subpages there to be found in the global search
        entry.fields.organizationPage.fields.theme !== 'standalone' &&
        // Subpage should not be searchable if the organization frontpage isn't searchable
        (entry.fields.organizationPage.fields.canBeFoundInSearchResults ??
          true) &&
        // Subpages should not be searchable if they belong to a parent subpage
        !entry.fields.organizationParentSubpage?.fields?.slug,
    )
  }

  doMapping(entries: IOrganizationSubpage[]) {
    if (entries.length > 0) {
      logger.info('Mapping organization subpage', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapOrganizationSubpage(entry)

          if (isCircular(mapped)) {
            logger.warn(
              'Failed to import organization subpage due to circularity',
              {
                id: entry?.sys?.id,
              },
            )
            return false
          }

          const content = extractStringsFromObject(
            (mapped.description ?? []).map(pruneNonSearchableSliceUnionFields),
          )

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

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
              ...childEntryIds.map((id) => ({
                key: id,
                type: 'hasChildEntryWithId',
              })),
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import organization subpage', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
