import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'
import graphqlTypeJson from 'graphql-type-json'
import { ValidationRuleDtoTypeEnum } from '../../../gen/fetch'

registerEnumType(ValidationRuleDtoTypeEnum, {
  name: 'ValidationRuleDtoTypeEnum',
})

@InputType()
export class ValidationRuleInput {
  @Field(() => ValidationRuleDtoTypeEnum)
  @IsEnum(ValidationRuleDtoTypeEnum)
  type!: ValidationRuleDtoTypeEnum

  @Field(() => graphqlTypeJson, { nullable: true })
  @IsOptional()
  value!: object | null
}
