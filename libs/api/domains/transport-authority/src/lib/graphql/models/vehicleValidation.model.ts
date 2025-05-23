import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleValidationMessage {
  @Field(() => String, { nullable: true })
  errorNo?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null
}

@ObjectType()
export class VehicleValidation {
  @Field(() => [VehicleValidationMessage], { nullable: true })
  errorMessages?: VehicleValidationMessage[] | null
}
