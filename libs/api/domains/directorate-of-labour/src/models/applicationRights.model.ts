import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApplicationRights {
  @Field(() => String, { nullable: true })
  rightsUnit?: string | null

  @Field(() => String, { nullable: true })
  rightsDescription?: string | null

  @Field(() => String, { nullable: true })
  months?: string | null

  @Field(() => String, { nullable: true })
  days?: string | null

  @Field(() => String, { nullable: true })
  daysLeft?: string | null
}
