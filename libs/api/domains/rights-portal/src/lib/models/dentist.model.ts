import { Field, ObjectType } from '@nestjs/graphql'
import { Address } from './address.model'
import { Bill } from './bill.model'

@ObjectType('RightsPortalDentist')
export class Dentist {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  office?: string | null

  @Field(() => Address, { nullable: true })
  address?: Address
}

@ObjectType('RightsPortalDentistUserRegistration')
export class UserDentistRegistration {
  @Field(() => String, { nullable: true })
  currentDentistName?: string | null

  @Field(() => [Bill], { nullable: true })
  billHistory?: Array<Bill> | null
}
