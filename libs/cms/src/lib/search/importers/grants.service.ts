import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IGrant } from '../../generated/contentfulTypes'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import {
  createTerms,
  extractChildEntryIds,
  extractStringsFromObject,
  pruneNonSearchableSliceUnionFields,
} from './utils'
import { mapGrant } from '../../models/grant.model'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class GrantsSyncService implements CmsSyncProvider<IGrant> {
  processSyncData(entries: processSyncDataInput<IGrant>) {
    // only process grants that we consider not to be empty
    const entriesToUpdate = entries.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (entry: Entry<any>): entry is IGrant =>
        entry.sys.contentType.sys.id === 'grant' && entry.fields.grantName,
    )
    return {
      entriesToUpdate,
      entriesToDelete: [],
    }
  }

  doMapping(entries: IGrant[]) {
    return entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapGrant(entry)

          if (isCircular(mapped)) {
            logger.warn('Circular reference found in grants', {
              id: entry?.sys?.id,
            })
            return false
          }

          const content = [
            mapped.fund?.title,
            mapped.fund?.parentOrganization.title,
            mapped.description,
            mapped.specialEmphasis
              ? extractStringsFromObject(
                  mapped?.specialEmphasis?.map(
                    pruneNonSearchableSliceUnionFields,
                  ),
                )
              : undefined,
            mapped.whoCanApply
              ? extractStringsFromObject(
                  mapped?.whoCanApply?.map(pruneNonSearchableSliceUnionFields),
                )
              : undefined,
            mapped.howToApply
              ? extractStringsFromObject(
                  mapped?.howToApply?.map(pruneNonSearchableSliceUnionFields),
                )
              : undefined,
            mapped.answeringQuestions
              ? extractStringsFromObject(
                  mapped?.answeringQuestions?.map(
                    pruneNonSearchableSliceUnionFields,
                  ),
                )
              : undefined,
            mapped?.applicationHints
              ? extractStringsFromObject(
                  mapped?.applicationHints?.map(
                    pruneNonSearchableSliceUnionFields,
                  ),
                )
              : undefined,
          ]
            .filter(isDefined)
            .join()

          const tags: Array<{
            key: string
            type: string
            value?: string
          }> = [
            mapped.typeTag
              ? {
                  key: mapped.typeTag.slug,
                  type: 'genericTag',
                  value: mapped.typeTag.title,
                }
              : null,
          ].filter(isDefined)

          mapped.categoryTags?.forEach((tag) => {
            if (tag) {
              tags.push({
                key: tag.slug,
                type: 'genericTag',
                value: tag.title,
              })
            }
          })

          if (mapped.fund) {
            tags.push({
              type: 'fund',
              key: mapped.fund.id,
              value: mapped.fund.title,
            })
          }

          if (mapped.fund?.parentOrganization?.slug) {
            tags.push({
              type: 'organization',
              key: mapped.fund.parentOrganization.slug,
              value: mapped.fund.parentOrganization.title,
            })
          }

          //Use the raw field to escape the mapping
          if (entry.fields.grantStatus) {
            tags.push({
              type: 'status',
              key: entry.fields.grantStatus,
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
            title: mapped.name,
            content,
            contentWordCount: content.split(/\s+/).length,
            type: 'webGrant',
            termPool: createTerms([mapped.name]),
            response: JSON.stringify({ ...mapped, typename: 'Grant' }),
            tags,
            dateUpdated: new Date().getTime().toString(),
            releaseDate: mapped.dateFrom ?? undefined,
            dateCreated: mapped.dateTo ?? entry.sys.createdAt,
          }
        } catch (error) {
          logger.warn('Failed to import grants', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
