import { Field, InputType, IntersectionType, OmitType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsString } from 'class-validator'
import { nullable } from 'zod'

@InputType()
export class PostBulkMailActionInput {
  @Field(() => [String])
  @IsArray()
  messageIds!: Array<string>

  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  action!: 'bookmark' | 'archive'

  @Field({
    description:
      'This status represents the nature of the request. True = adding item status. False = removing item status.',
  })
  @IsBoolean()
  status!: boolean
}

@InputType()
export class PostBulkMailActionResolverInput extends OmitType(
  PostBulkMailActionInput,
  ['nationalId'] as const,
) {}
