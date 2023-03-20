import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApplicationRights {
  @Field(() => String)
  rightsUnit!: string

  @Field(() => String)
  rightsDescription!: string

  @Field(() => String)
  months!: string

  @Field(() => String)
  days!: string

  @Field(() => String)
  daysLeft!: string
}
