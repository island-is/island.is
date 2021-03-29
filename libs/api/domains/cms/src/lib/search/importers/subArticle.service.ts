import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { ISubArticle } from '../../generated/contentfulTypes'
import { mapSubArticle } from '../../models/subArticle.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class SubArticleSyncService implements CmsSyncProvider<ISubArticle> {
  processSyncData(entries: processSyncDataInput<ISubArticle>) {
    logger.info('Processing sync data for subarticles')

    // only process subarticles that we consider not to be empty and dont have circular structures
    return entries.filter(
      (entry: Entry<any>): entry is ISubArticle =>
        entry.sys.contentType.sys.id === 'news' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
  }

  doMapping(entries: ISubArticle[]) {
    logger.info('Mapping subarticles', { count: entries.length })
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapSubArticle(entry)
          const content = extractStringsFromObject(mapped.body)
          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webSubArticle',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'SubArticle' }),
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import subarticle', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
