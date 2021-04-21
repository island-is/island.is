import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'
import { ValidationRuleDtoTypeEnum } from '../../../gen/fetch'
import graphqlTypeJson from 'graphql-type-json'

@InputType()
export class ValidationRuleInput {
  @Field(() => ValidationRuleDtoTypeEnum)
  @IsEnum(ValidationRuleDtoTypeEnum)
  type!: ValidationRuleDtoTypeEnum

  @Field(() => graphqlTypeJson)
  @IsOptional()
  value?: object
}
