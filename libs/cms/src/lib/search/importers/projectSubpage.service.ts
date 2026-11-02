import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { IProjectSubpage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapProjectSubpage } from '../../models/projectSubpage.model'
import { extractChildEntryIds, extractContentFromSlices } from './utils'

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
        !!entry.fields.title &&
        !!entry.fields.slug &&
        // A subpage can't be linked to without its project page
        !!entry.fields.projectPage?.fields?.slug
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
          const mapped = mapProjectSubpage(entry)
          const projectPage = entry.fields.projectPage as NonNullable<
            IProjectSubpage['fields']['projectPage']
          >
          const projectSlug = (projectPage.fields.slug ?? '').trim()

          const content = extractContentFromSlices([
            ...(mapped.content ?? []),
            ...(mapped.slices ?? []),
            ...(mapped.bottomSlices ?? []),
          ])

          // Only the project page itself is tagged below, not everything it
          // contains, so that editing a sibling subpage doesn't re-index this one
          const { projectPage: _, ...fields } = entry.fields
          const childEntryIds = extractChildEntryIds({
            sys: entry.sys,
            fields,
          })

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webProjectSubpage',
            response: JSON.stringify({
              ...mapped,
              projectSlug,
              typename: 'ProjectSubpage',
            }),
            tags: [
              { key: mapped.slug, type: 'slug' },
              { key: projectSlug, type: 'project' },
              // Used to clean up the subpages when the project page gets deleted
              { key: projectPage.sys.id, type: 'referencedBy' },
              // Keeps the project slug on this document up to date
              { key: projectPage.sys.id, type: 'hasChildEntryWithId' },
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
