import { Field, InputType } from '@nestjs/graphql'
import { IsObject, IsOptional, IsString } from 'class-validator'
import graphqlTypeJson from 'graphql-type-json'

@InputType()
export class SubmitApplicationInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  event!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  answers?: object
}
