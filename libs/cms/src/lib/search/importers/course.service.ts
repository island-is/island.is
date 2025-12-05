import isCircular from 'is-circular'
import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { MappedData } from '@island.is/content-search-indexer/types'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import type { ICourse } from '../../generated/contentfulTypes'
import type { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'
import { extractChildEntryIds } from './utils'
import { mapCourse } from '../../models/course.model'

@Injectable()
export class CourseSyncService implements CmsSyncProvider<ICourse> {
  processSyncData(entries: processSyncDataInput<ICourse>) {
    const entriesToUpdate: ICourse[] = []
    const entriesToDelete: string[] = []

    for (const entry of entries) {
      if (entry.sys.contentType.sys.id !== 'course') {
        continue
      }

      const course = entry as ICourse

      if (course.fields.title && course.fields.organization?.fields?.slug) {
        entriesToUpdate.push(course)
      } else {
        entriesToDelete.push(entry.sys.id)
      }
    }

    return {
      entriesToUpdate,
      entriesToDelete,
    }
  }

  doMapping(entries: ICourse[]) {
    if (entries.length > 0) {
      logger.info('Mapping courses', {
        count: entries.length,
      })
    }
    const courseEntries = entries
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapCourse(entry)
          if (isCircular(mapped)) {
            logger.warn('Circular reference found in course', {
              id: entry.sys.id,
            })
            return false
          }

          const tags = []

          for (const tag of entry.fields.categories ?? []) {
            tags.push({
              value: tag.fields.title,
              key: tag.fields.slug,
              type: 'genericTag',
            })
          }

          if (entry.fields.organization?.fields?.slug) {
            tags.push({
              key: entry.fields.organization.fields.slug,
              type: 'organization',
            })
          }

          // Tag the document with the ids of its children so we can later look up what document a child belongs to
          const childEntryIds = extractChildEntryIds(entry)
          for (const id of childEntryIds) {
            tags.push({
              value: id,
              key: id,
              type: 'hasChildEntryWithId',
            })
          }

          const contentSections = []

          if (entry.fields.description) {
            contentSections.push(
              documentToPlainTextString(entry.fields.description),
            )
          }

          const content = contentSections.join(' ')

          return {
            _id: mapped.id,
            title: mapped.title,
            content,
            contentWordCount: content.split(' ').length,
            type: 'webCourse',
            response: JSON.stringify(mapped),
            tags,
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import course', {
            error: error.message,
            id: entry?.sys?.id,
          })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))

    return courseEntries
  }
}
