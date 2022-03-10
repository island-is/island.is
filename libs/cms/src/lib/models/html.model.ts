import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  Document,
  BLOCKS,
  TopLevelBlock,
  Block,
  Inline,
  Text,
} from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'
import { RichTextContent } from 'contentful'
import { SliceUnion } from '../unions/slice.union'

type RichText = Block | Inline | Text

const deepChange = (obj: Document | TopLevelBlock | RichText, id: string) => ({
  ...obj,
  data: {
    ...obj?.data,
    target: {
      ...obj?.data?.target,
      fields: {
        ...obj?.data?.target?.fields,
        details: {
          ...obj?.data?.target?.details,
          content: (obj?.data?.target?.fields?.details?.content ?? []).filter(
            (field: RichTextContent) => id !== field?.data?.target?.sys?.id,
          ),
        },
      },
    },
  },
})

const sanitizeData = (html: Document | TopLevelBlock) => ({
  ...deepChange(html, html?.data?.target?.sys?.id),
  content: (
    (html?.content as (TopLevelBlock | RichText)[]) ??
    ([] as (TopLevelBlock | RichText)[])
  ).map((content) => deepChange(content, content?.data?.target?.sys?.id)),
})

@ObjectType()
export class Html {
  @Field(() => String)
  typename = 'Html'

  @Field(() => ID)
  id!: string

  @Field(() => graphqlTypeJson)
  document?: Document
}

export const mapHtml = (html: Document | TopLevelBlock, id: string): Html => {
  const newHtml = sanitizeData(html)

  switch (newHtml.nodeType) {
    case BLOCKS.DOCUMENT:
      return {
        typename: 'Html',
        id: String(id),
        document: newHtml as Document,
      }

    default:
      return {
        typename: 'Html',
        id: String(id),
        document: {
          nodeType: BLOCKS.DOCUMENT,
          content: [newHtml as TopLevelBlock],
          data: {},
        },
      }
  }
}

export const isHtml = (x: typeof SliceUnion): x is Html => x instanceof Html
