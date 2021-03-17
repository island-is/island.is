import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNamespaceInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  namespace?: string

  @Field(() => String)
  @IsString()
  lang = 'is-IS'
}
