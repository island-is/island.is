import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePresignedPostInput {
  @Field()
  fileName!: string
  @Field()
  type!: string
}
