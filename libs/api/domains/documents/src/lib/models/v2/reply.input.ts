import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('DocumentReplyInput')
export class ReplyInput {
  @Field()
  @IsString()
  readonly documentId!: string

  @Field()
  @IsString()
  readonly body!: string

  @Field()
  @IsString()
  readonly requesterEmail!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly subject?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  readonly requesterName?: string
}
