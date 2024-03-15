import { ObjectType, Field } from '@nestjs/graphql'
import { Practice } from './practice.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('RightsPortalDentist')
export class Dentist {
  @Field(() => Number)
  id!: number

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => [Practice], { nullable: true })
  practices?: Practice[] | null
}

@ObjectType('RightsPortalPaginatedDentists')
export class PaginatedDentistsResponse extends PaginatedResponse(Dentist) {}
