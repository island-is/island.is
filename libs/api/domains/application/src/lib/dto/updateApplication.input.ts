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
  UpdateApplicationDtoTypeIdEnum,
  UpdateApplicationDtoStateEnum,
} from '../../../gen/fetch'

registerEnumType(UpdateApplicationDtoStateEnum, {
  name: 'UpdateApplicationDtoStateEnum',
})

registerEnumType(UpdateApplicationDtoTypeIdEnum, {
  name: 'UpdateApplicationDtoTypeIdEnum',
})

@InputType()
export class UpdateApplicationInput {
  @Field((type) => String)
  @IsString()
  id: string

  @Field((type) => UpdateApplicationDtoTypeIdEnum)
  @IsEnum(UpdateApplicationDtoTypeIdEnum)
  typeId: UpdateApplicationDtoTypeIdEnum

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

  @Field((type) => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  attachments?: Array<string>

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  answers?: object
}
