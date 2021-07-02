import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IOpenDataPage } from '../generated/contentfulTypes'
import * as types from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class OpenDataPage {
  @Field(() => ID)
  id!: string

  @Field()
  pageTitle!: string
}

export const mapOpenDataPage = ({
  fields,
  sys,
}: types.IOpenDataPage): SystemMetadata<OpenDataPage> => ({
  typename: 'OpenDataPage',
  id: sys.id,
  pageTitle: fields.pageTitle ?? '',
})
