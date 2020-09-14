import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator'
import { UpdateApplicationDtoStateEnum } from '../../../gen/fetch'

registerEnumType(UpdateApplicationDtoStateEnum, {
  name: 'UpdateApplicationDtoStateEnum',
})

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

  @Field((type) => UpdateApplicationDtoStateEnum, { nullable: true })
  @IsEnum(UpdateApplicationDtoStateEnum)
  @IsOptional()
  state?: UpdateApplicationDtoStateEnum

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  attachments?: object

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  answers?: object
}
