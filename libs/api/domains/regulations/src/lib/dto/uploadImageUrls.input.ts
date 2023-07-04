import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class UploadImageUrlsInput {
  @Field()
  @IsString()
  readonly regId!: string
  @Field(() => [String])
  readonly urls!: Array<string>
}
