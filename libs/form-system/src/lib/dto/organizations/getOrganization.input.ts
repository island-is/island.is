import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemGetOrganizationInput')
export class GetOrganizationInput {
  @Field(() => String)
  id!: string
}
