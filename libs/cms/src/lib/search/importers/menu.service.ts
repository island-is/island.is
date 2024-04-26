import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IMenu } from '../../generated/contentfulTypes'
import { mapMenu } from '../../models/menu.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

@Injectable()
export class MenuSyncService implements CmsSyncProvider<IMenu> {
  processSyncData(entries: processSyncDataInput<IMenu>) {
    return entries.filter(
      (entry: Entry<any>): entry is IMenu =>
        entry.sys.contentType.sys.id === 'menu',
    )
  }

  doMapping(entries: IMenu[]) {
    if (entries.length > 0) {
      logger.info('Mapping menu', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapMenu(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webMenu',
            response: JSON.stringify({ ...mapped, typename: 'Menu' }),
            tags: [
              {
                key: mapped.title,
                type: 'name',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import menu', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
