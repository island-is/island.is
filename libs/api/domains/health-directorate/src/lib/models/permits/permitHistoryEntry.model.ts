import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { Country } from './country.model'

@ObjectType('HealthDirectoratePatientDataPermitHistoryEntry')
export class PermitHistoryEntry {
  @Field(() => [Country])
  countries!: Country[]

  @Field(() => [String])
  consentTypes!: string[]

  @Field(() => GraphQLISODateTime)
  validFrom!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validTo?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  changedAt?: Date

  @Field(() => GraphQLISODateTime)
  createdAt!: Date
}
