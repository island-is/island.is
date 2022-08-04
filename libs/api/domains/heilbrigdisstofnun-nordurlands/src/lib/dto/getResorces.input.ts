import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetResourcesInput {
  @Field()
  personSsn!: string
}
