import { Entry } from 'contentful'
import { Injectable } from '@nestjs/common'
import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { IVacancy } from '../../generated/contentfulTypes'
import { mapVacancy } from '../../models/vacancy.model'
import { extractChildEntryIds } from './utils'

@Injectable()
export class VacancySyncService implements CmsSyncProvider<IVacancy> {
  processSyncData(entries: processSyncDataInput<IVacancy>) {
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is IVacancy =>
        entry.sys.contentType.sys.id === 'vacancy' && !!entry.fields.title,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IVacancy[]) {
    if (entries.length > 0) {
      logger.info('Mapping Vacancy', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapVacancy(entry)

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          return {
            _id: mapped.id,
            title: mapped.title ?? '',
            type: 'webVacancy',
            response: JSON.stringify({
              ...mapped,
              typename: 'Vacancy',
            }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
            tags: childEntryIds.map((id) => ({
              key: id,
              type: 'hasChildEntryWithId',
            })),
          }
        } catch (error) {
          logger.warn('Failed to import vacancy', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
