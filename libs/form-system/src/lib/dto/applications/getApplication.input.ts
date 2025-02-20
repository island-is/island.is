import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemGetApplicationInput')
export class GetApplicationInput {
  @Field(() => String)
  id!: string
}
