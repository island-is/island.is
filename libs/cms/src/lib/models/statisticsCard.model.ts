import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IStatisticsCard } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class StatisticsCard {
  @Field()
  title!: string

  @Field()
  statistic!: string

  @CacheField(() => Image, { nullable: true })
  image?: Image | null
}

export const mapStatisticsCard = ({
  fields,
}: IStatisticsCard): StatisticsCard => ({
  title: fields?.title ?? '',
  statistic: fields?.statistic ?? '',
  image: fields.image ? mapImage(fields.image) : null,
})
