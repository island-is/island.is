import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import { IEnhancedAsset } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { mapEnhancedAsset } from '../../models/enhancedAsset.model'

@Injectable()
export class EnhancedAssetSyncService
  implements CmsSyncProvider<IEnhancedAsset>
{
  processSyncData(entries: processSyncDataInput<IEnhancedAsset>) {
    return entries.filter(
      (entry: Entry<any>): entry is IEnhancedAsset =>
        entry.sys.contentType.sys.id === 'enhancedAsset' &&
        !!entry.fields.title,
    )
  }

  doMapping(entries: IEnhancedAsset[]) {
    logger.info('Mapping enhanced asset', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapEnhancedAsset(entry)
          return {
            _id: mapped.id,
            title: mapped.title,
            type: 'webEnhancedAsset',
            response: JSON.stringify({
              ...mapped,
              typename: 'EnhancedAsset',
            }),
            tags: [
              {
                key: mapped.organization?.slug ?? '',
                type: 'organization',
                value: mapped.organization?.title ?? '',
              },
              ...mapped.genericTags.map((tag) => ({
                type: 'genericTag',
                key: tag.slug,
                value: tag.title,
              })),
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
            releaseDate: mapped.releaseDate,
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
