import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ApplicationInformationPeriod {
  @Field(() => String)
  from!: string

  @Field(() => String)
  to!: string

  @Field(() => String)
  ratio!: string

  @Field(() => Boolean)
  approved!: boolean

  @Field(() => Boolean)
  paid!: boolean

  @Field(() => String, { nullable: true })
  rightsCodePeriod?: string | null

  @Field(() => String, { nullable: true })
  firstPeriodStart?: string | null

  // VMST no longer returns `days` per period; kept nullable so existing
  // queries keep working.
  @Field(() => String, { nullable: true })
  days?: string | null
}
