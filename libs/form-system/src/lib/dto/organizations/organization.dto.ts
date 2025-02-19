import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FormDto } from '../forms/form.dto'

@ObjectType('FormSystemOrganization')
export class OrganizationDto {
  @ApiProperty()
  @Field(() => String)
  id?: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType

  @ApiProperty({ type: String })
  @Field(() => String)
  nationalId!: string

  @ApiPropertyOptional({ type: [FormDto] })
  @Field(() => [FormDto], { nullable: 'itemsAndList' })
  forms?: FormDto[]
}
