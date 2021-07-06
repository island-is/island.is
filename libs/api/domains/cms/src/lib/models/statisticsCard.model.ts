import { Field, ObjectType } from '@nestjs/graphql'
import { IStatisticsCard } from '../generated/contentfulTypes'

@ObjectType()
export class StatisticsCard {
  @Field()
  title!: string

  @Field()
  statistic!: string

//   @Field()
//   image?: Asset | null
}

export const mapStatisticsCard = ({ fields }: IStatisticsCard): StatisticsCard => ({
  title: fields?.title ?? '',
  statistic: fields?.statistic ?? '',
})
