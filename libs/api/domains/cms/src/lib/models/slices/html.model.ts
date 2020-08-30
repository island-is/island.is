import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Document, BLOCKS, TopLevelBlock } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class Html {
  constructor(initializer: Html) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field(() => graphqlTypeJson)
  json: Document
}

export const mapHtml = (
  html: Document | TopLevelBlock,
  id: number | string = -1,
): Html => {
  switch (html.nodeType) {
    case BLOCKS.DOCUMENT:
      return new Html({ id: String(id), json: html })
    default:
      return new Html({
        id: String(id),
        json: { nodeType: BLOCKS.DOCUMENT, content: [html], data: {} },
      })
  }
}
