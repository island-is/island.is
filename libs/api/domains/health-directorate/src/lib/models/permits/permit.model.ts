import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { PermitStatusEnum } from '../enums'
import { Country } from './country.model'

@ObjectType('HealthDirectoratePatientDataPermit')
export class Permit {
  @Field(() => ID)
  cacheId!: string

  @Field({ nullable: true })
  id?: string

  @Field(() => PermitStatusEnum)
  status!: PermitStatusEnum

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validFrom?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validTo?: Date

  @Field(() => [String])
  codes!: string[]

  @Field(() => [Country])
  countries!: Country[]
}
