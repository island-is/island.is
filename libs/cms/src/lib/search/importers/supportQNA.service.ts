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
  pruneNonSearchableSliceUnionFields,
  extractChildEntryIds,
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
    const entriesToUpdate = entries.reduce(
      (processedEntries: ISupportQna[], entry: Entry<any>) => {
        if (this.validateArticle(entry)) {
          try {
            const mappedEntry = mapSupportQNA(entry)
            if (!isCircular(mappedEntry)) {
              processedEntries.push(entry)
            } else {
              logger.warn('Circular reference found in supportQNA', {
                id: entry?.sys?.id,
              })
            }
          } catch (error) {
            logger.warn('Failed to map supportQNA', {
              error: error.message,
              id: entry?.sys?.id,
            })
          }
        }
        return processedEntries
      },
      [],
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: ISupportQna[]) {
    if (entries.length > 0) {
      logger.info('Mapping SupportQNAs', { count: entries.length })
    }

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: SupportQNA

        try {
          mapped = mapSupportQNA(entry)
          // get the searchable content of this article
          const searchableContent = extractStringsFromObject(
            mapped.answer.map(pruneNonSearchableSliceUnionFields),
          )

          const tags: MappedData['tags'] = []

          if (entry.fields?.organization.fields?.slug) {
            tags.push({
              key: entry.fields.organization.fields.slug,
              value: entry.fields.organization.fields.title,
              type: 'organization',
            })
          }
          if (entry.fields?.slug) {
            tags.push({
              key: entry.fields?.slug,
              type: 'slug',
            })
          }
          if (entry.fields?.category?.fields?.slug) {
            tags.push({
              key: entry.fields.category.fields.slug,
              value: entry.fields.category.fields.title,
              type: 'category',
            })
          }
          if (entry.fields?.subCategory?.fields?.slug) {
            tags.push({
              key: entry.fields.subCategory.fields.slug,
              value: entry.fields.subCategory.fields.title,
              type: 'subcategory',
            })
          }

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
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import SupportQNA', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
