import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class GetNewsTagsInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lang?: string = 'is'

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  size?: number = 10
}
