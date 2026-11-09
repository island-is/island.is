import type { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import type {
  IProjectParentSubpage,
  IProjectSubpage,
} from '../../generated/contentfulTypes'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  PROJECT_PAGE_SEARCH_TAG_TYPE,
  PROJECT_SEARCH_TAG_TYPE,
  PROJECT_PARENT_SUBPAGE_SEARCH_TYPE,
  ProjectPageSearchChild,
} from '../projectPageSearch'
import { extractChildEntryIds } from './utils'
import {
  extractProjectSubpageContent,
  withoutProjectPageReference,
} from './projectSubpage.service'

const getChapters = (entry: IProjectParentSubpage) =>
  (entry.fields.pages ?? []).filter(
    (page): page is IProjectSubpage =>
      // Chapters should belong to the same project page, the same rule as on the web
      page?.fields?.projectPage?.sys?.id ===
        entry.fields.projectPage?.sys?.id &&
      Boolean(page.fields.title?.trim()) &&
      Boolean(page.fields.slug?.trim()),
  )

@Injectable()
export class ProjectParentSubpageSyncService
  implements CmsSyncProvider<IProjectParentSubpage>
{
  processSyncData(entries: processSyncDataInput<IProjectParentSubpage>) {
    const entriesToUpdate: IProjectParentSubpage[] = []
    const entriesToDelete: string[] = []

    for (const entry of entries) {
      if (entry.sys.contentType.sys.id !== 'projectParentSubpage') {
        continue
      }

      if (
        Boolean(entry.fields.title?.trim()) &&
        Boolean(entry.fields.slug?.trim()) &&
        Boolean(entry.fields.projectPage?.sys?.id) &&
        getChapters(entry as IProjectParentSubpage).length > 0
      ) {
        entriesToUpdate.push(entry as IProjectParentSubpage)
      } else {
        entriesToDelete.push(entry.sys.id)
      }
    }

    return {
      entriesToUpdate,
      entriesToDelete,
    }
  }

  doMapping(entries: IProjectParentSubpage[]) {
    if (entries.length > 0) {
      logger.info('Mapping project parent subpage', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const projectPageId = entry.fields.projectPage?.sys?.id
          if (!projectPageId) {
            return false
          }
          const projectSlug = entry.fields.projectPage?.fields?.slug?.trim()
          const chapters = getChapters(entry)

          // The parent subpage is found through the titles and content of its chapters
          const content = chapters
            .map((chapter) =>
              [chapter.fields.title, extractProjectSubpageContent(chapter)]
                .filter(Boolean)
                .join(' '),
            )
            .join(' ')

          const response: ProjectPageSearchChild = {
            typename: 'ProjectParentSubpage',
            id: entry.sys.id,
            title: entry.fields.title,
            slug: entry.fields.slug.trim(),
            projectPageId,
            projectSlug,
            chapters: chapters.map((chapter) => ({
              id: chapter.sys.id,
              title: chapter.fields.title,
              slug: chapter.fields.slug.trim(),
            })),
          }

          // Tag the document with the ids of its children so we can later look up what document a child belongs to.
          // All linked pages are included, also the ones left out of the chapters,
          // so that fixing a page's title, slug or project page reindexes this document
          const childEntryIds = extractChildEntryIds({
            ...withoutProjectPageReference(entry),
            fields: {
              ...entry.fields,
              projectPage: undefined,
              pages: (entry.fields.pages ?? [])
                .filter(Boolean)
                .map(withoutProjectPageReference),
            },
          })

          return {
            _id: entry.sys.id,
            title: entry.fields.title,
            content,
            contentWordCount: content ? content.split(/\s+/).length : 0,
            type: PROJECT_PARENT_SUBPAGE_SEARCH_TYPE,
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
          logger.warn('Failed to import project parent subpage', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
