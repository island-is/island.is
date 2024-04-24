import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemGetPropertyInput')
export class GetPropertyInput {
  @Field(() => String)
  propertyId!: string
}
