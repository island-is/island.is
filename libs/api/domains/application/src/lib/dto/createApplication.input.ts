import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator'
import { CreateApplicationDtoTypeIdEnum } from '../../../gen/fetch'

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

  @Field((type) => String)
  @IsString()
  state: string

  @Field((type) => graphqlTypeJson, { nullable: true })
  @IsObject()
  @IsOptional()
  attachments?: object

  @Field((type) => CreateApplicationDtoTypeIdEnum)
  @IsEnum(CreateApplicationDtoTypeIdEnum)
  typeId: CreateApplicationDtoTypeIdEnum

  @Field((type) => graphqlTypeJson)
  @IsObject()
  answers: object
}
