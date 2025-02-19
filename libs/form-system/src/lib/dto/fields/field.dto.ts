import { Field, ObjectType } from '@nestjs/graphql'
import { FieldSettings, LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ListItemDto } from '../listItems/listItem.dto'
import { ValueDto } from '../applications/value.dto'

@ObjectType('FormSystemField')
export class FieldDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  screenId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @Field(() => Number)
  displayOrder!: number

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  description!: LanguageType

  @ApiProperty()
  @Field(() => Boolean)
  isPartOfMultiset!: boolean

  @ApiProperty()
  @Field(() => Boolean)
  isRequired!: boolean

  @ApiProperty()
  @Field(() => Boolean)
  isHidden!: boolean

  @ApiPropertyOptional({ type: FieldSettings })
  @Field(() => FieldSettings, { nullable: true })
  fieldSettings?: FieldSettings

  @ApiProperty()
  @Field(() => String)
  fieldType!: string

  @ApiPropertyOptional({ type: [ListItemDto] })
  @Field(() => [ListItemDto], { nullable: 'itemsAndList' })
  list?: ListItemDto[]

  @ApiPropertyOptional({ type: [ValueDto] })
  @Field(() => [ValueDto], { nullable: 'itemsAndList' })
  values?: ValueDto[]
}
