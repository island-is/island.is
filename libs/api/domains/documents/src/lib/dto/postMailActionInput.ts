import { Field, InputType, OmitType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class PostMailActionInput {
  @Field()
  @IsString()
  messageId!: string

  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  action!: 'archive' | 'unarchive' | 'bookmark' | 'unbookmark'
}

@InputType()
export class PostMailActionResolverInput extends OmitType(PostMailActionInput, [
  'nationalId',
] as const) {}
