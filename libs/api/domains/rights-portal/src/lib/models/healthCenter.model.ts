import { Field, ObjectType } from '@nestjs/graphql'
import { Address } from './address.model'

ObjectType('RightsPortalHealthCenterRegistration')
export class HealthCenterRegistration {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date | null

  @Field(() => Date, { nullable: true })
  dateTo?: Date | null

  @Field(() => String, { nullable: true })
  registeredHealthCenter?: HealthCenter

  @Field(() => String, { nullable: true })
  doctor?: string | null
}

@ObjectType('RightsPortalHealthCenterUserRegistration')
export class HealthCenterUserRegistration {
  @Field(() => HealthCenterRegistration, { nullable: true })
  current?: HealthCenterRegistration

  @Field(() => [HealthCenterRegistration], { nullable: true })
  history?: Array<HealthCenterRegistration>
}

@ObjectType('RightsPortalHealthCenter')
export class HealthCenter {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  district?: string | null

  @Field(() => Address, { nullable: true })
  address?: Address
}
