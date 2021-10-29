import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { IsString, IsOptional, IsObject } from 'class-validator'

@InputType()
export class UpdateApplicationInput {
  @Field((type) => String)
  @IsString()
  id: string

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  answers?: object
}
