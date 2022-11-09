import GraphqlTypeJson from 'graphql-type-json'
import { Document as RichTextDocument } from '@contentful/rich-text-types'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ITableSlice } from '../generated/contentfulTypes'

@ObjectType()
export class TableSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => GraphqlTypeJson, { nullable: true })
  tableContent?: RichTextDocument | null
}

export const mapTableSlice = ({
  fields,
  sys,
}: ITableSlice): SystemMetadata<TableSlice> => ({
  typename: 'TableSlice',
  id: sys.id,
  title: fields.title ?? '',
  tableContent: fields.tableContent ?? null,
})
