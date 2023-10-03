import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalPageInfo')
export class PageInfo {
  @Field(() => Boolean, { nullable: true })
  hasPreviousPage?: boolean | null

  @Field(() => Boolean, { nullable: true })
  hasNextPage?: boolean | null

  @Field(() => String, { nullable: true })
  startCursor?: string | null

  @Field(() => String, { nullable: true })
  endCursor?: string | null
}
