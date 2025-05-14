import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('ExamineeEligibility')
export class ExamineeEligibility {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => Boolean, { nullable: true })
  isEligible?: boolean

  @Field(() => String, { nullable: true })
  errorMsg?: string | null

  @Field(() => String, { nullable: true })
  errorMsgEn?: string | null
}
