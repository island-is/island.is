import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('VacanciesFilterOption')
export class FilterOption {
  @Field(() => String)
  label!: string

  @Field(() => String)
  value!: string
}
