import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Document, BLOCKS, TopLevelBlock } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'
import { ContentType, RichTextContent } from 'contentful'

import { Slice } from './slice.model'

const deepChange = (obj: Record<any, any>, id: string) => ({
  ...obj,
  data: {
    ...obj.data,
    target: {
      ...obj.data?.target,
      fields: {
        ...obj.data?.target?.fields,
        details: {
          ...obj.data?.target?.details,
          content: (obj.data?.target?.fields?.details?.content ?? []).filter(
            (field: RichTextContent) => id !== field?.data?.target?.sys?.id,
          ),
        },
      },
    },
  },
})

const sanitizeData = (html: Document | TopLevelBlock) => {
  const dataId = html.data?.target?.sys?.id
  const dataFields: { data: { target: ContentType } }[] =
    html.data?.target?.fields?.details?.content
  const contentId = html?.content?.some((c) => c.data?.target?.sys?.id)

  if (contentId) {
    return {
      ...html,
      content: (html?.content as any[]).map((content) => {
        const subId = content?.data?.target?.sys?.id

        return deepChange(content, subId)
      }),
    }
  }

  if (
    (dataFields ?? []).some((field) => dataId === field?.data?.target?.sys?.id)
  ) {
    return deepChange(html, dataId)
  }

  return html
}

@ObjectType()
export class Html {
  constructor(initializer: Html) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field(() => graphqlTypeJson)
  document: Document
}

export const mapHtml = (html: Document | TopLevelBlock, id: string): Html => {
  const newHtml = sanitizeData(html)

  switch (html.nodeType) {
    case BLOCKS.DOCUMENT:
      return new Html({
        id: String(id),
        document: newHtml as Document,
      })

    default:
      return new Html({
        id: String(id),
        document: {
          nodeType: BLOCKS.DOCUMENT,
          content: [newHtml as TopLevelBlock],
          data: {},
        },
      })
  }
}

export const isHtml = (x: typeof Slice): x is Html => x instanceof Html
