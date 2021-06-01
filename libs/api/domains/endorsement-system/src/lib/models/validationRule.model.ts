import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsObject, IsOptional } from 'class-validator'
import { ValidationRuleDtoTypeEnum } from '../../../gen/fetch'
import graphqlTypeJson from 'graphql-type-json'

registerEnumType(ValidationRuleDtoTypeEnum, {
  name: 'ValidationRuleDtoTypeEnum',
})

@ObjectType()
export class ValidationRule {
  @Field(() => ValidationRuleDtoTypeEnum)
  @IsEnum(ValidationRuleDtoTypeEnum)
  type!: ValidationRuleDtoTypeEnum

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  @IsObject()
  value!: object | null
}
