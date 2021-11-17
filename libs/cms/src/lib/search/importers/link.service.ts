import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { ILink } from '../../generated/contentfulTypes'
import { mapLink } from '../../models/link.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

@Injectable()
export class LinkSyncService implements CmsSyncProvider<ILink> {
  processSyncData(entries: processSyncDataInput<ILink>) {
    return entries.filter(
      (entry: Entry<any>): entry is ILink =>
        entry.sys.contentType.sys.id === 'link' && entry.fields.searchable,
    )
  }

  doMapping(entries: ILink[]) {
    logger.info('Mapping links', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapLink(entry)
          return {
            _id: mapped.id,
            title: mapped.text,
            content: mapped.description,
            type: 'webLink',
            response: JSON.stringify({ ...mapped, typename: 'Link' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import link', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
