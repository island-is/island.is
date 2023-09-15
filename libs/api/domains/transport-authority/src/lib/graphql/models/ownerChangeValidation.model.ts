import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OwnerChangeValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class OwnerChangeValidation {
  @Field(() => Boolean)
  hasError!: boolean

  @Field(() => [OwnerChangeValidationMessage], { nullable: true })
  errorMessages?: OwnerChangeValidationMessage[] | null
}
