import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ExemptionValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class ExemptionValidation {
  @Field(() => Boolean)
  isInspected!: boolean

  @Field(() => Boolean)
  isInOrder!: boolean

  @Field(() => [ExemptionValidationMessage], { nullable: true })
  errorMessages?: ExemptionValidationMessage[] | null
}
