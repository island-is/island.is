import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IMultipleStatistics } from '../generated/contentfulTypes'
import { Statistics, mapStatistics } from './statistics.model'
import { Link, mapLink } from './link.model'

@ObjectType()
export class MultipleStatistics {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [Statistics])
  statistics!: Statistics[]

  @CacheField(() => Link, { nullable: true })
  link!: Link | null

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean
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
  hasBorderAbove: fields.hasBorderAbove ?? true,
})
