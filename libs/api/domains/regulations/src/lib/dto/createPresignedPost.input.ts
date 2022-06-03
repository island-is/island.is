import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePresignedPostInput {
  @Field()
  readonly fileName!: string
  @Field()
  readonly type!: string
}
