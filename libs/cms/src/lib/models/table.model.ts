import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ITableSlice } from '../generated/contentfulTypes'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class TableSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => Html, { nullable: true })
  tableContent?: Html | null
}

export const mapTableSlice = ({
  fields,
  sys,
}: ITableSlice): SystemMetadata<TableSlice> => {
  return {
    typename: 'TableSlice',
    id: sys.id,
    title: fields.title ?? '',
    tableContent: fields.tableContent
      ? mapHtml(fields.tableContent, sys.id + ':tableContent')
      : null,
  }
}
