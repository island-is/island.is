import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('SeminarsIndividualValidationItem')
export class IndividualValidationItem {
  @Field(() => String, { nullable: true })
  nationalID?: string | null

  @Field(() => Boolean, { nullable: true })
  mayTakeCourse?: boolean | null

  @Field(() => String, { nullable: true })
  errorMessage?: string | null

  @Field(() => String, { nullable: true })
  errorMessageEn?: string | null

  @Field(() => String, { nullable: true })
  errorCode?: string | null
}
