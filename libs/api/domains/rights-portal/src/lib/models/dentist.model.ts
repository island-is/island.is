import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Address } from './address.model'
import { Bill } from './bill.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('RightsPortalDentist')
export class Dentist {
  @Field(() => ID)
  id!: number

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  practice?: string | null

  @Field(() => String, { nullable: true })
  phone?: string | null

  @Field(() => Address, { nullable: true })
  address?: Address
}

@ObjectType('RightsPortalUserDentistRegistration')
export class UserDentistRegistration {
  @Field(() => String, { nullable: true })
  currentDentistName?: string | null

  @Field(() => [Bill], { nullable: true })
  billHistory?: Array<Bill> | null
}

@ObjectType('RightsPortalPaginatedDentistsResponse')
export class PaginatedDentistsResponse extends PaginatedResponse(Dentist) {}
