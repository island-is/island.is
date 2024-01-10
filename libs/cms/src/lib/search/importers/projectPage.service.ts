import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IProjectPage } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapProjectPage } from '../../models/projectPage.model'

@Injectable()
export class ProjectPageSyncService implements CmsSyncProvider<IProjectPage> {
  processSyncData(entries: processSyncDataInput<IProjectPage>) {
    return entries.filter(
      (entry: Entry<any>): entry is IProjectPage =>
        entry.sys.contentType.sys.id === 'projectPage' && !!entry.fields.title,
    )
  }

  doMapping(entries: IProjectPage[]) {
    if (entries.length > 0) {
      logger.info('Mapping project page', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapProjectPage(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webProjectPage',
            response: JSON.stringify({
              ...mapped,
              typename: 'ProjectPage',
            }),
            tags: entry.fields?.slug
              ? [
                  {
                    key: entry.fields.slug,
                    type: 'slug',
                  },
                ]
              : [],
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
