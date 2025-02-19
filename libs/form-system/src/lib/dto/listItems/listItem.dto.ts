import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

@ObjectType('FormSystemListItem')
export class ListItemDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  label!: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @ApiProperty()
  @Field(() => String)
  value!: string

  @ApiProperty()
  @Field(() => Number)
  displayOrder!: number

  @ApiProperty()
  @Field(() => Boolean)
  isSelected!: boolean
}
