import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IProjectPage, IProjectSubpage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapProjectPage } from '../../models/projectPage.model'
import { mapProjectSubpage } from '../../models/projectSubpage.model'
import {
  extractChildEntryIds,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'
import { SliceUnion } from '../../unions/slice.union'

const extractContent = (slices: (typeof SliceUnion | null | undefined)[]) =>
  extractStringsFromObject(
    slices
      .filter((slice): slice is typeof SliceUnion => Boolean(slice))
      .map(pruneNonSearchableSliceUnionFields),
  )

@Injectable()
export class ProjectPageSyncService implements CmsSyncProvider<IProjectPage> {
  processSyncData(entries: processSyncDataInput<IProjectPage>) {
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IProjectPage =>
        entry.sys.contentType.sys.id === 'projectPage' && !!entry.fields.title,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  // A subpage has no reference to its project page, so its documents are created along with the page
  private mapSubpages(entry: IProjectPage, projectSlug: string): MappedData[] {
    return (entry.fields.projectSubpages ?? [])
      .filter((subpage) => subpage.fields?.title && subpage.fields?.slug)
      .map<MappedData | boolean>((subpage: IProjectSubpage) => {
        try {
          const mapped = mapProjectSubpage(subpage)
          const content = extractContent([
            ...(mapped.content ?? []),
            ...mapped.slices,
            ...(mapped.bottomSlices ?? []),
          ])

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
              { key: entry.sys.id, type: 'referencedBy' },
            ],
            dateCreated: subpage.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import project subpage', {
            error: error.message,
            id: subpage?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }

  doMapping(entries: IProjectPage[]) {
    if (entries.length > 0) {
      logger.info('Mapping project page', { count: entries.length })
    }

    return entries.flatMap<MappedData>((entry) => {
      try {
        const mapped = mapProjectPage(entry)
        const projectSlug = entry.fields?.slug?.trim()

        const tags = projectSlug
          ? [
              {
                key: projectSlug,
                type: 'slug',
              },
              {
                key: projectSlug,
                type: 'project',
              },
            ]
          : []

        // Tag the document with the ids of its children so we can later look up what document a child belongs to
        const childEntryIds = extractChildEntryIds(entry)
        for (const id of childEntryIds) {
          tags.push({
            key: id,
            type: 'hasChildEntryWithId',
          })
        }

        const content = extractContent([
          ...(mapped.content ?? []),
          ...(mapped.slices ?? []),
          ...(mapped.bottomSlices ?? []),
        ])

        return [
          {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webProjectPage',
            response: JSON.stringify({
              ...mapped,
              typename: 'ProjectPage',
            }),
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          },
          ...(projectSlug ? this.mapSubpages(entry, projectSlug) : []),
        ]
      } catch (error) {
        logger.warn('Failed to import project page', {
          error: error.message,
          id: entry?.sys?.id,
        })
        return []
      }
    })
  }
}
