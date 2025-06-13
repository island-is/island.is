import type { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import type { Entry } from 'contentful'
import type {
  IOrganizationParentSubpage,
  IOrganizationSubpage,
} from '../../generated/contentfulTypes'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  extractChildEntryIds,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'
import { mapOrganizationParentSubpage } from '../../models/organizationParentSubpage.model'
import { mapOrganizationSubpage } from '../../models/organizationSubpage.model'

const safelyExtractContentFromOrganizationSubpage = (
  subpage: IOrganizationSubpage,
) => {
  try {
    const mappedSubpage = mapOrganizationSubpage(subpage)
    const content = extractStringsFromObject(
      (mappedSubpage.description ?? []).map(pruneNonSearchableSliceUnionFields),
    )
    return content
  } catch (error) {
    logger.warn(
      'Failed to map organization subpage to get searchable content',
      {
        error: error.message,
        id: subpage?.sys?.id,
      },
    )
    return ''
  }
}

@Injectable()
export class OrganizationParentSubpageSyncService
  implements CmsSyncProvider<IOrganizationParentSubpage>
{
  processSyncData(entries: processSyncDataInput<IOrganizationParentSubpage>) {
    return entries.filter(
      (entry: Entry<any>): entry is IOrganizationParentSubpage =>
        entry.sys.contentType.sys.id === 'organizationParentSubpage' &&
        !!entry.fields.title &&
        !!entry.fields.slug &&
        (entry.fields.pages ?? []).length > 0 &&
        // Parent subpage should not be searchable if the organization frontpage isn't searchable
        (entry.fields.organizationPage?.fields?.organization?.fields
          ?.canPagesBeFoundInSearchResults ??
          entry.fields.organizationPage?.fields?.canBeFoundInSearchResults ??
          true),
    )
  }

  doMapping(entries: IOrganizationParentSubpage[]) {
    if (entries.length > 0) {
      logger.info('Mapping organization parent subpage', {
        count: entries.length,
      })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapOrganizationParentSubpage(entry)

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          const contentSections: string[] = []

          for (const page of entry.fields.pages) {
            const pageContent =
              safelyExtractContentFromOrganizationSubpage(page)
            if (pageContent) {
              contentSections.push(pageContent)
            }
          }

          const content = contentSections.join(' ')

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webOrganizationParentSubpage',
            response: JSON.stringify({
              ...mapped,
              typename: 'OrganizationParentSubpage',
            }),
            tags: [
              ...childEntryIds.map((id) => ({
                key: id,
                type: 'hasChildEntryWithId',
              })),
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import organization parent subpage', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
