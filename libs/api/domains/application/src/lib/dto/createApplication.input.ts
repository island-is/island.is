import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator'
import {
  CreateApplicationDtoTypeIdEnum,
  CreateApplicationDtoStateEnum,
} from '../../../gen/fetch'

registerEnumType(CreateApplicationDtoStateEnum, {
  name: 'CreateApplicationDtoStateEnum',
})

registerEnumType(CreateApplicationDtoTypeIdEnum, {
  name: 'CreateApplicationDtoTypeIdEnum',
})

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
  externalId?: string

  @Field((type) => CreateApplicationDtoStateEnum)
  @IsEnum(CreateApplicationDtoStateEnum)
  state: CreateApplicationDtoStateEnum

  @Field((type) => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  attachments?: Array<string>

  @Field((type) => CreateApplicationDtoTypeIdEnum)
  @IsEnum(CreateApplicationDtoTypeIdEnum)
  typeId: CreateApplicationDtoTypeIdEnum

  @Field((type) => graphqlTypeJson)
  @IsObject()
  answers: object
}
