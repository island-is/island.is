import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IProjectPage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapProjectPage } from '../../models/projectPage.model'
import { extractChildEntryIds } from './utils'

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

  doMapping(entries: IProjectPage[]) {
    if (entries.length > 0) {
      logger.info('Mapping project page', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapProjectPage(entry)

          const tags = entry.fields?.slug
            ? [
                {
                  key: entry.fields.slug,
                  type: 'slug',
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

          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webProjectPage',
            response: JSON.stringify({
              ...mapped,
              typename: 'ProjectPage',
            }),
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import project page', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
