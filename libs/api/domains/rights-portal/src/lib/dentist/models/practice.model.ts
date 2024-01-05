import { ObjectType, Field } from '@nestjs/graphql'

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
