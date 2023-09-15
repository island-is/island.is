import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetPresignedUrlInput {
  @Field(() => String)
  id!: string

  @Field(() => String)
  type!: string
}
