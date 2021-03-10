import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator'
import {
  CreateApplicationDtoStatusEnum,
  CreateApplicationDtoTypeIdEnum,
} from '../../../gen/fetch'

registerEnumType(CreateApplicationDtoTypeIdEnum, {
  name: 'CreateApplicationDtoTypeIdEnum',
})

registerEnumType(CreateApplicationDtoStatusEnum, {
  name: 'CreateApplicationDtoStatusEnum',
})

@InputType()
export class CreateApplicationInput {
  @Field(() => String)
  @IsString()
  applicant!: string

  @Field(() => [String])
  @IsArray()
  assignees!: string[]

  @Field(() => String)
  @IsString()
  state!: string

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  attachments?: object

  @Field(() => CreateApplicationDtoTypeIdEnum)
  @IsEnum(CreateApplicationDtoTypeIdEnum)
  typeId!: CreateApplicationDtoTypeIdEnum

  @Field(() => graphqlTypeJson)
  @IsObject()
  answers!: object

  @Field(() => CreateApplicationDtoStatusEnum)
  @IsEnum(CreateApplicationDtoStatusEnum)
  status!: CreateApplicationDtoStatusEnum
}
