import type { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import isCircular from 'is-circular'
import type { IProjectSubpage } from '../../generated/contentfulTypes'
import { mapProjectSubpage } from '../../models/projectSubpage.model'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  PROJECT_PAGE_SEARCH_TAG_TYPE,
  PROJECT_SEARCH_TAG_TYPE,
  PROJECT_SUBPAGE_SEARCH_TYPE,
  ProjectPageSearchChild,
} from '../projectPageSearch'
import {
  extractChildEntryIds,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'

// The project page is the parent of a subpage, not a child, so it shouldn't be traversed when finding child entries
export const withoutProjectPageReference = <
  T extends { sys: { id: string }; fields: { projectPage?: unknown } },
>(
  entry: T,
): T => ({
  ...entry,
  fields: { ...entry.fields, projectPage: undefined },
})

export const extractProjectSubpageContent = (entry: IProjectSubpage) => {
  const mapped = mapProjectSubpage(entry)

  if (isCircular(mapped)) {
    throw new Error('Project subpage is circular')
  }

  return extractStringsFromObject(
    [
      ...(mapped.content ?? []),
      ...(mapped.slices ?? []),
      ...(mapped.bottomSlices ?? []),
    ]
      .filter(Boolean)
      .map((slice) => pruneNonSearchableSliceUnionFields(slice as never)),
  ).trim()
}

@Injectable()
export class ProjectSubpageSyncService
  implements CmsSyncProvider<IProjectSubpage>
{
  processSyncData(entries: processSyncDataInput<IProjectSubpage>) {
    const entriesToUpdate: IProjectSubpage[] = []
    const entriesToDelete: string[] = []

    for (const entry of entries) {
      if (entry.sys.contentType.sys.id !== 'projectSubpage') {
        continue
      }

      if (
        Boolean(entry.fields.title) &&
        Boolean(entry.fields.slug?.trim()) &&
        // Subpages are only searchable through the project page they belong to
        Boolean(entry.fields.projectPage?.sys?.id)
      ) {
        entriesToUpdate.push(entry as IProjectSubpage)
      } else {
        entriesToDelete.push(entry.sys.id)
      }
    }

    return {
      entriesToUpdate,
      entriesToDelete,
    }
  }

  doMapping(entries: IProjectSubpage[]) {
    if (entries.length > 0) {
      logger.info('Mapping project subpage', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const projectPageId = entry.fields.projectPage?.sys?.id
          if (!projectPageId) {
            return false
          }
          const projectSlug = entry.fields.projectPage?.fields?.slug?.trim()
          const content = extractProjectSubpageContent(entry)

          const response: ProjectPageSearchChild = {
            typename: 'ProjectSubpage',
            id: entry.sys.id,
            title: entry.fields.title,
            slug: entry.fields.slug.trim(),
            projectPageId,
            projectSlug,
          }

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(
            withoutProjectPageReference(entry),
          )

          return {
            _id: entry.sys.id,
            title: entry.fields.title,
            content,
            contentWordCount: content ? content.split(/\s+/).length : 0,
            type: PROJECT_SUBPAGE_SEARCH_TYPE,
            response: JSON.stringify(response),
            tags: [
              {
                key: projectPageId,
                type: PROJECT_PAGE_SEARCH_TAG_TYPE,
              },
              ...(projectSlug
                ? [{ key: projectSlug, type: PROJECT_SEARCH_TAG_TYPE }]
                : []),
              ...childEntryIds.map((id) => ({
                key: id,
                type: 'hasChildEntryWithId',
              })),
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import project subpage', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
