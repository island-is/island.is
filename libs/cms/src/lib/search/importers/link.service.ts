import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { ILink } from '../../generated/contentfulTypes'
import { mapLink } from '../../models/link.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'

@Injectable()
export class LinkSyncService implements CmsSyncProvider<ILink> {
  processSyncData(entries: processSyncDataInput<ILink>) {
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is ILink =>
        entry.sys.contentType.sys.id === 'link' && entry.fields.searchable,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: ILink[]) {
    if (entries.length > 0) {
      logger.info('Mapping links', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapLink(entry)

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

          return {
            _id: mapped.id,
            title: mapped.text,
            content: mapped.intro,
            type: 'webLink',
            response: JSON.stringify({ ...mapped, typename: 'Link' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
            tags: childEntryIds.map((id) => ({
              key: id,
              type: 'hasChildEntryWithId',
            })),
          }
        } catch (error) {
          logger.warn('Failed to import link', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
