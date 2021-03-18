import { MappedData } from '@island.is/content-search-indexer/types'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { Entry } from 'contentful'
import isCircular from 'is-circular'
import { IAboutSubPage, IPage } from '../../generated/contentfulTypes'
import { mapAboutPage } from '../../models/aboutPage.model'
import { CmsSyncProvider, processSyncDataInput } from '../cmsSync.service'

import {
  createTerms,
  extractStringsFromObject,
  numberOfProcessEntries,
  numberOfLinks,
} from './utils'

interface ProcessedData {
  aboutPages: IPage[]
  aboutSubPages: { [parentId: string]: IAboutSubPage[] }
}

@Injectable()
export class AboutPageSyncService
  implements CmsSyncProvider<IPage | IAboutSubPage, ProcessedData> {
  processSyncData(
    entries: processSyncDataInput<IPage | IAboutSubPage>,
  ): ProcessedData {
    // only process pages that we consider not to be empty and dont have circular structures
    const aboutPages = entries.filter(
      (entry: Entry<any>): entry is IPage =>
        entry.sys.contentType.sys.id === 'page' &&
        !!entry.fields.title &&
        !isCircular(entry),
    )
    const aboutSubPages = entries
      .filter(
        (entry: Entry<any>): entry is IAboutSubPage =>
          entry.sys.contentType.sys.id === 'aboutSubPage' &&
          !!entry.fields.title &&
          !isCircular(entry),
      )
      .reduce(
        (subPageMap: { [parentId: string]: IAboutSubPage[] }, subPage) => {
          const parentId = subPage.fields.parent?.sys.id
          if (parentId) {
            return {
              ...subPageMap,
              [parentId]: [...(subPageMap[parentId] ?? []), subPage],
            }
          } else {
            return subPageMap
          }
        },
        {},
      )

    return { aboutPages, aboutSubPages }
  }

  doMapping(entries: ProcessedData) {
    logger.info('Mapping about page', { count: entries.aboutPages.length })

    return entries.aboutPages
      .map<MappedData | boolean>((entry) => {
        try {
          const mapped = mapAboutPage(entry)

          const content = extractStringsFromObject({ ...mapped.slices }) // this function only accepts plain js objects
          // add content from child pages to have this parent page match searches
          const subAboutPageContent = (entries.aboutSubPages[mapped.id] ?? [])
            .map((subAboutPage) =>
              extractStringsFromObject({
                intro: `${subAboutPage.fields.title} ${subAboutPage.fields.intro}`,
                content: subAboutPage.fields.content,
              }),
            )
            .join(' ')

          return {
            _id: mapped.id,
            title: mapped.title,
            content: `${content} ${subAboutPageContent}`,
            contentWordCount: content.split(/\s+/).length,
            processEntryCount: numberOfProcessEntries(mapped.slices),
            ...numberOfLinks(mapped.slices),
            type: 'webAboutPage',
            termPool: createTerms([mapped.title]),
            response: JSON.stringify({ ...mapped, typename: 'AboutPage' }),
            tags: [
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import about page', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
