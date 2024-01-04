import { ObjectType, Field } from '@nestjs/graphql'
import { Country } from './country.model'

@ObjectType('IntellectualPropertiesPriority')
export class Priority {
  @Field({ nullable: true })
  applicationDate?: Date

  @Field({ nullable: true })
  creationDate?: Date

  @Field({ nullable: true })
  number?: string

  @Field(() => Country)
  country?: Country
}
