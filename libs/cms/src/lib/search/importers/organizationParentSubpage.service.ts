import type { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import type { Entry } from 'contentful'
import type { IOrganizationParentSubpage } from '../../generated/contentfulTypes'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'
import { mapOrganizationParentSubpage } from '../../models/organizationParentSubpage.model'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

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
        entry.fields.organizationPage?.fields?.theme !== 'standalone' &&
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
            if (page.fields.description) {
              const pageContent = documentToPlainTextString(
                page.fields.description,
              )
              if (pageContent) {
                contentSections.push(pageContent)
              }
            }
          }

          const content = contentSections.join(' ')

          const tags = childEntryIds.map((id) => ({
            key: id,
            type: 'hasChildEntryWithId',
          }))

          if (entry.fields?.organizationPage?.fields?.slug) {
            tags.push({
              key: entry.fields.organizationPage.fields.slug,
              type: 'organization',
            })
          }

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
            tags,
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
