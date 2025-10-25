import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PermitStatusEnum } from '../enums'
import { Country } from './country.model'

@ObjectType('HealthDirectoratePatientDataPermit')
export class Permit {
  @Field(() => ID)
  id!: string

  @Field(() => PermitStatusEnum)
  status!: PermitStatusEnum

  @Field()
  createdAt!: Date

  @Field()
  validFrom!: Date

  @Field()
  validTo!: Date

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
