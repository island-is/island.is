import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { INews } from '../../generated/contentfulTypes'
import { mapNews } from '../../models/news.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
  extractChildEntryIds,
} from './utils'

@Injectable()
export class NewsSyncService implements CmsSyncProvider<INews> {
  processSyncData(entries: processSyncDataInput<INews>) {
    // only process news that we consider not to be empty
    const entriesToUpdate = entries.filter(
      (entry: Entry<any>): entry is INews =>
        entry.sys.contentType.sys.id === 'news' &&
        !!entry.fields.title &&
        !!entry.fields.date,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: INews[]) {
    if (entries.length > 0) {
      logger.info('Mapping news', { count: entries.length })
    }
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapNews(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in news', {
              id: entry?.sys?.id,
            })
            return false
          }

          const content = extractStringsFromObject(
            mapped.content.map(pruneNonSearchableSliceUnionFields),
          )

          const tags = [
            {
              key: mapped.slug,
              type: 'slug',
            },
            ...mapped.genericTags.map((tag) => ({
              // add all tags as meta data to this document so we can query by it later
              key: tag.slug,
              type: 'genericTag',
              value: tag.title,
            })),
          ]

          if (mapped.organization?.slug) {
            tags.push({
              key: mapped.organization.slug,
              type: 'organization',
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
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webNews',
            termPool: createTerms([mapped.title, mapped.intro]),
            response: JSON.stringify({ ...mapped, typename: 'News' }),
            tags,
            dateCreated: mapped.date,
            dateUpdated: new Date().getTime().toString(),
            releaseDate: mapped.initialPublishDate || null,
          }
        } catch (error) {
          logger.warn('Failed to import news', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
