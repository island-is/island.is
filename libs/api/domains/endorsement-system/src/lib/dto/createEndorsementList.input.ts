import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import {
  EndorsementListDtoEndorsementMetaEnum,
  EndorsementListDtoTagsEnum,
} from '../../../gen/fetch'
import { ValidationRuleInput } from './validationRule.input'

registerEnumType(EndorsementListDtoEndorsementMetaEnum, {
  name: 'EndorsementListDtoEndorsementMetaEnum',
})

registerEnumType(EndorsementListDtoTagsEnum, {
  name: 'EndorsementListDtoTagsEnum',
})

@InputType()
export class CreateEndorsementListDto {
  @Field()
  @IsString()
  title!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description!: string | null

  @Field(() => [EndorsementListDtoEndorsementMetaEnum])
  @IsEnum(EndorsementListDtoEndorsementMetaEnum, { each: true })
  endorsementMeta!: EndorsementListDtoEndorsementMetaEnum[]

  @Field(() => [EndorsementListDtoTagsEnum])
  @IsEnum(EndorsementListDtoTagsEnum, { each: true })
  tags!: EndorsementListDtoTagsEnum[]

  @Field(() => [ValidationRuleInput])
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleInput)
  validationRules!: ValidationRuleInput[]
}
