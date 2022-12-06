import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OwnerChangeValidation {
  @Field(() => Boolean)
  hasError!: boolean

  @Field(() => [OwnerChangeValidationMessage], { nullable: true })
  errorMessages?: OwnerChangeValidationMessage[] | null
}

@ObjectType()
export class OwnerChangeValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: number | null

  @Field(() => String, { nullable: true })
  message?: string | null
}
