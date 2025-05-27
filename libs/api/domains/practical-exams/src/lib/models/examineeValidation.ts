import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WorkMachineExamineeValidation')
export class WorkMachineExamineeValidation {
  @Field(() => String, { nullable: true })
  nationalId?: string | null

  @Field(() => [String], { nullable: true })
  examCategories?: string[] | null

  @Field(() => Boolean, { nullable: true })
  doesntHaveToPayLicenseFee?: boolean

  @Field(() => Boolean, { nullable: true })
  isValid?: boolean

  @Field(() => String, { nullable: true })
  errorMessage?: string | null

  @Field(() => String, { nullable: true })
  errorMessageEn?: string | null
}
