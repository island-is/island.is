import { Field, ID, ObjectType } from '@nestjs/graphql'

import { SystemMetadata } from '@island.is/shared/types'

import { IMultipleStatistics } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { mapStatistics,Statistics } from './statistics.model'

@ObjectType()
export class MultipleStatistics {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => [Statistics])
  statistics!: Statistics[]

  @Field(() => Link, { nullable: true })
  link!: Link | null
}

export const mapMultipleStatistics = ({
  fields,
  sys,
}: IMultipleStatistics): SystemMetadata<MultipleStatistics> => ({
  typename: 'MultipleStatistics',
  id: sys.id,
  title: fields.title ?? '',
  statistics: (fields.statistics ?? []).map(mapStatistics),
  link: fields.link ? mapLink(fields.link) : null,
})
