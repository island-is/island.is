import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreatePresignedPostInput {
  @Field()
  @IsString()
  readonly fileName!: string
  @Field()
  @IsString()
  readonly type!: string
}
