import { PaginatedResponse } from '@island.is/nest/pagination'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrug')
export class Drug {
  @Field(() => String, { nullable: true })
  nordicCode?: string | null

  @Field(() => String, { nullable: true })
  atcCode?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  form?: string | null

  @Field(() => String, { nullable: true })
  strength?: string | null

  @Field(() => String, { nullable: true })
  packaging?: string | null

  @Field(() => Number, { nullable: true })
  price?: number | null
}

@ObjectType('RightsPortalPaginatedDrug')
export class PaginatedDrugResponse extends PaginatedResponse(Drug) {}
