import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PlateOrderValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class PlateOrderValidation {
  @Field(() => Boolean)
  hasError!: boolean

  @Field(() => [PlateOrderValidationMessage], { nullable: true })
  errorMessages?: PlateOrderValidationMessage[] | null
}
