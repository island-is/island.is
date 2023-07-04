import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OperatorChangeValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class OperatorChangeValidation {
  @Field(() => Boolean)
  hasError!: boolean

  @Field(() => [OperatorChangeValidationMessage], { nullable: true })
  errorMessages?: OperatorChangeValidationMessage[] | null
}
