import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { IsString, IsOptional, IsObject } from 'class-validator'

@InputType()
export class UpdateApplicationInput {
  @Field((type) => String)
  @IsString()
  id: string

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  applicant?: string

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  assignee?: string

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  externalId?: string

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  attachments?: object

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  answers?: object
}
