import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalAddress')
export class Address {
  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => String, { nullable: true })
  municipality?: string | null

  @Field(() => String, { nullable: true })
  streetAddress?: string | null
}
