import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrugs')
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
