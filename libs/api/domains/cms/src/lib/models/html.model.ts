import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Document, BLOCKS, TopLevelBlock } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'

import { Slice } from './slice.model'

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

export const mapHtml = (
  html: Document | TopLevelBlock,
  id: number | string = -1,
): Html => {
  switch (html.nodeType) {
    case BLOCKS.DOCUMENT:
      return new Html({
        id: String(id),
        document: html,
      })

    default:
      return new Html({
        id: String(id),
        document: {
          nodeType: BLOCKS.DOCUMENT,
          content: [html],
          data: {},
        },
      })
  }
}

export const isHtml = (x: typeof Slice): x is Html => x instanceof Html
