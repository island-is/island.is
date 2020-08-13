import { Field, InputType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator'
import { ApplicationStateEnum } from '../../../gen/fetch'

@InputType()
export class CreateApplicationInput {
  @Field((type) => String)
  @IsString()
  applicant: string

  @Field((type) => String)
  @IsString()
  assignee: string

  @Field((type) => String, { nullable: true })
  @IsString()
  @IsOptional()
  externalId: string

  @Field((type) => ApplicationStateEnum)
  @IsEnum(ApplicationStateEnum)
  state: ApplicationStateEnum

  @Field((type) => [String], { nullable: true })
  @IsArray()
  attachments: Array<string>

  @Field((type) => String)
  @IsString()
  typeId: string

  @Field((type) => graphqlTypeJson)
  @IsObject()
  answers: object
}
