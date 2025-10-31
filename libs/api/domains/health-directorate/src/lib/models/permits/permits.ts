import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PermitStatusEnum } from '../enums'
import { Country } from './country.model'

@ObjectType('HealthDirectoratePatientDataPermit')
export class Permit {
  @Field(() => ID)
  cacheId!: string

  @Field()
  id!: string

  @Field(() => PermitStatusEnum)
  status!: PermitStatusEnum

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  validFrom?: Date

  @Field({ nullable: true })
  validTo?: Date

  @Field(() => [String])
  codes!: string[]

  @Field(() => [Country])
  countries!: Country[]
}

@ObjectType('HealthDirectoratePatientDataPermits')
export class Permits {
  @Field(() => [Permit])
  data!: Permit[]
}

@ObjectType('HealthDirectoratePatientDataPermitReturn')
export class PermitReturn {
  @Field(() => Boolean)
  status!: boolean
}
