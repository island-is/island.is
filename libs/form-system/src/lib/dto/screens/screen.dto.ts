import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { FieldDto } from '../fields/field.dto'

@ObjectType('FormSystemScreen')
export class ScreenDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => String)
  sectionId!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @Field(() => Number)
  displayOrder!: number

  @ApiProperty()
  @Field(() => Boolean)
  isHidden!: boolean

  @ApiProperty()
  @Field(() => Boolean)
  isCompleted!: boolean

  @ApiProperty()
  @Field(() => Number)
  multiset!: number

  @ApiProperty()
  @Field(() => Boolean)
  callRuleset!: boolean

  @ApiPropertyOptional({ type: [FieldDto] })
  @Field(() => [FieldDto], { nullable: 'itemsAndList' })
  fields?: FieldDto[]
}
