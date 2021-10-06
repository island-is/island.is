import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IStatistic } from '../generated/contentfulTypes'

@ObjectType()
export class Statistic {
  @Field(() => ID)
  id!: string

  @Field()
  value!: string

  @Field()
  label!: string
}

export const mapStatistic = ({ fields, sys }: IStatistic): Statistic => ({
  id: sys.id,
  value: fields.value ?? '',
  label: fields.label ?? '',
})
