import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { ISupportQna } from '../../generated/contentfulTypes'
import { mapSupportQNA, SupportQNA } from '../../models/supportQNA.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractStringsFromObject,
  numberOfProcessEntries,
  numberOfLinks,
} from './utils'

@Injectable()
export class SupportQNASyncService implements CmsSyncProvider<ISupportQna> {
  // only process questions that we consider not to be empty
  validateArticle(
    singleEntry: Entry<any> | ISupportQna,
  ): singleEntry is ISupportQna {
    return (
      singleEntry.sys.contentType.sys.id === 'supportQNA' &&
      !!singleEntry.fields.question
    )
  }

  processSyncData(entries: processSyncDataInput<ISupportQna>) {
    // only process questions that we consider not to be empty and don't have circular structures
    return entries.reduce(
      (processedEntries: ISupportQna[], entry: Entry<any>) => {
        if (this.validateArticle(entry)) {
          if (!isCircular(entry)) {
            processedEntries.push(entry)
          } else {
            logger.warn('Circular reference found in question', {
              id: entry.sys.id,
            })
          }
        }
        return processedEntries
      },
      [],
    )
  }

  doMapping(entries: ISupportQna[]) {
    logger.info('Mapping SupportQNAs', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: SupportQNA

        try {
          mapped = mapSupportQNA(entry)
          // get the searchable content of this article
          const searchableContent = extractStringsFromObject(mapped.answer)

          return {
            _id: mapped.id,
            title: mapped.title,
            content: searchableContent,
            contentWordCount: searchableContent.split(/\s+/).length,
            processEntryCount: numberOfProcessEntries(mapped.answer),
            ...numberOfLinks(mapped.answer),
            type: 'webQNA',
            termPool: createTerms([
              mapped.title,
              mapped.category?.title ?? '',
              mapped.organization?.title ?? '',
            ]),
            response: JSON.stringify({ ...mapped, typename: 'SupportQNA' }),
            tags: [
              {
                key: entry.fields?.category?.fields?.slug ?? '',
                value: entry.fields?.category?.fields?.title,
                type: 'category',
              },
              {
                key: entry.fields?.organization.fields?.slug ?? '',
                value: entry.fields?.organization.fields?.title,
                type: 'organization',
              },
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import SupportQNA', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
