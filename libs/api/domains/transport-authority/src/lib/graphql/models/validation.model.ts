import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TransportAuthorityValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string

  @Field(() => String, { nullable: true })
  defaultMessage?: string
}

@ObjectType()
export class TransportAuthorityValidation {
  @Field(() => Boolean)
  hasError!: boolean

  @Field(() => [TransportAuthorityValidationMessage], { nullable: true })
  errorMessages?: TransportAuthorityValidationMessage[]

  @Field(() => [TransportAuthorityValidationMessage], { nullable: true })
  infoMessages?: TransportAuthorityValidationMessage[]
}
