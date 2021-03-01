import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IGroupedMenu } from '../../generated/contentfulTypes'
import { mapGroupedMenu } from '../../models/groupedMenu.model'

import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

@Injectable()
export class GroupedMenuSyncService implements CmsSyncProvider<IGroupedMenu> {
  processSyncData(entries: processSyncDataInput<IGroupedMenu>) {
    return entries.filter(
      (entry: Entry<any>): entry is IGroupedMenu =>
        entry.sys.contentType.sys.id === 'groupedMenu',
    )
  }

  doMapping(entries: IGroupedMenu[]) {
    logger.info('Mapping grouped menu', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapGroupedMenu(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webGroupedMenu',
            response: JSON.stringify({ ...mapped, typename: 'GroupedMenu' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import grouped menu', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
