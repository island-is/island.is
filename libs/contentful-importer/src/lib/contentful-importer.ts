import { createClient } from 'contentful-management'
import {
  EntryProp,
  Entry,
} from 'contentful-management/dist/typings/entities/entry'
import { Environment } from 'contentful-management/dist/typings/entities/environment'
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown'
import TurndownService from 'turndown'
import curry from 'curry'
import { ContentfulImportOptions, ContentfulImportData } from './types'

export class ContentfulImporter {
  options: ContentfulImportOptions
  environment: Environment
  constructor (options: ContentfulImportOptions) {
    this.options = options
  }

  async connect () {
    const client = createClient({
      accessToken: this.options.accessToken,
      retryLimit: 20,
    })
    const space = await client.getSpace(this.options.spaceId)
    this.environment = await space.getEnvironment(this.options.environmentId)
    return this
  }

  localeValue = curry((locale, value) => ({ [locale]: value }))

  async mapFields (
    locale: string,
    data: ContentfulImportData,
  ): Promise<Omit<EntryProp, 'sys'>> {
    const addLocaleValue = this.localeValue(locale)
    const turndownService = new TurndownService()
    const contentfulFields = {}
    for (const [fieldName, { type, value }] of Object.entries(data)) {
      switch (type) {
        case 'text': {
          contentfulFields[fieldName] = addLocaleValue(value)
          break
        }
        // TODO: Handle entity reference in markdown
        case 'html': {
          const markdown = turndownService.turndown(value.content)
          const richTextFieldValue = await richTextFromMarkdown(markdown)

          // if we have embeded content blocks
          if (value.references?.length) {
            const referenceBlocks = value.references.map((id) => ({
              nodeType: 'embedded-entry-block',
              content: [],
              data: {
                target: {
                  sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id,
                  },
                },
              },
            }))
            richTextFieldValue.content = [
              ...richTextFieldValue.content,
              ...referenceBlocks,
            ]
          }
          contentfulFields[fieldName] = addLocaleValue(richTextFieldValue)
          break
        }
        case 'reference': {
          if (Array.isArray(value)) {
            contentfulFields[fieldName] = addLocaleValue(
              value.map((id) => ({
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id,
                },
              })),
            )
          } else {
            contentfulFields[fieldName] = addLocaleValue({
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: value,
              },
            })
          }
          break
        }
      }
    }
    return { fields: contentfulFields }
  }

  async importContentType (
    contentTypeId: string,
    data: ContentfulImportData,
    { locale = 'is-IS' } = {},
  ): Promise<Entry> {
    const contentfulData = await this.mapFields(locale, data)
    return this.environment.createEntry(contentTypeId, contentfulData)
  }
}
