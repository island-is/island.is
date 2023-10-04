import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Bill } from './bill.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('RightsPortalDentistPractice')
export class Practice {
  @Field(() => String, { nullable: true })
  practice?: string | null

  @Field(() => String, { nullable: true })
  region?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  address?: string | null
}

@ObjectType('RightsPortalDentist')
export class Dentist {
  @Field(() => Number)
  id!: number

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => [Practice], { nullable: true })
  practices?: Array<Practice> | null
}

@ObjectType('RightsPortalCurrentDentist')
export class CurrentDentist {
  @Field(() => ID)
  id!: number

  @Field(() => String, { nullable: true })
  name?: string | null
}

@ObjectType('RightsPortalDentistStatus')
export class DentistStatus {
  @Field(() => Boolean, { nullable: true })
  isInsured?: boolean | null

  @Field(() => Boolean, { nullable: true })
  canRegister?: boolean | null

  @Field(() => String, { nullable: true })
  contractType?: string | null
}

@ObjectType('RightsPortalUserDentistInformation')
export class DentistInformation {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => Number, { nullable: true })
  id?: number | null

  @Field(() => DentistStatus, { nullable: true })
  status?: DentistStatus | null
}

@ObjectType('RightsPortalUserDentistRegistration')
export class UserDentistRegistration {
  @Field(() => DentistInformation, { nullable: true })
  dentist?: DentistInformation | null

  @Field(() => [Bill], { nullable: true })
  history?: Array<Bill> | null
}

@ObjectType('RightsPortalPaginatedDentists')
export class PaginatedDentistsResponse extends PaginatedResponse(Dentist) {}
