import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { ISubArticle } from '../../generated/contentfulTypes'
import { mapSubArticle } from '../../models/subArticle.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
  removeEntryHyperlinkFields,
  extractChildEntryIds,
} from './utils'

@Injectable()
export class SubArticleSyncService implements CmsSyncProvider<ISubArticle> {
  // only process subArticles that we consider not to be empty
  validateSubArticle(
    singleEntry: Entry<any> | ISubArticle,
  ): singleEntry is ISubArticle {
    return (
      singleEntry.sys.contentType.sys.id === 'subArticle' &&
      !!singleEntry.fields.title &&
      !!singleEntry.fields.slug &&
      !!singleEntry.fields.parent?.fields
    )
  }

  processSyncData(entries: processSyncDataInput<ISubArticle>) {
    const entriesToUpdate: ISubArticle[] = []
    const entriesToDelete: string[] = []

    for (const entry of entries) {
      if (!this.validateSubArticle(entry)) {
        entriesToDelete.push(entry.sys.id)
        continue
      }

      // remove nested subArticles from parent article
      const { subArticles, relatedArticles, ...prunedArticleFields } =
        entry.fields.parent.fields

      const processedArticle = {
        ...entry.fields.parent,
        fields: {
          ...prunedArticleFields,
        },
      }

      // overwrite the parent as the processed and pruned article
      const processedEntry = {
        ...entry,
        fields: {
          ...entry.fields,
          parent: processedArticle,
        },
      }
      // An entry hyperlink does not need the extra content present in
      // the entry hyperlink associated fields
      // We remove them from the reference itself on nodeType `entry-hyperlink`
      if (processedEntry.fields?.content) {
        removeEntryHyperlinkFields(processedEntry.fields.content)
      }
      try {
        const mappedEntry = mapSubArticle(processedEntry)
        if (!isCircular(mappedEntry)) {
          entriesToUpdate.push(processedEntry as ISubArticle)
        }
      } catch (error) {
        logger.warn('Failed to map subArticle', {
          error: error.message,
          id: entry?.sys?.id,
        })
      }
    }

    return {
      entriesToUpdate,
      entriesToDelete,
    }
  }

  doMapping(entries: ISubArticle[]) {
    if (entries.length > 0) {
      logger.info('Mapping subarticles', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapSubArticle(entry)
          const content = extractStringsFromObject(
            mapped.body.map(pruneNonSearchableSliceUnionFields),
          )

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)

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
            tags: [
              {
                key: entry.fields?.parent?.fields?.category?.fields?.slug ?? '',
                value: entry.fields?.parent?.fields?.category?.fields?.title,
                type: 'category',
              },
              ...childEntryIds.map((id) => ({
                key: id,
                type: 'hasChildEntryWithId',
              })),
            ],
          }
        } catch (error) {
          logger.warn('Failed to import subarticle', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
