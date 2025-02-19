import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ScreenDto } from '../screens/screen.dto'

@ObjectType('FormSystemSection')
export class SectionDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty({ type: LanguageType })
  @Field(() => LanguageType)
  name!: LanguageType

  @ApiProperty()
  @Field(() => String)
  sectionType!: string

  @ApiProperty()
  @Field(() => Number)
  displayOrder!: number

  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType

  @ApiProperty()
  @Field(() => Boolean)
  isHidden!: boolean

  @ApiProperty()
  @Field(() => Boolean)
  isCompleted!: boolean

  @ApiPropertyOptional({ type: [ScreenDto] })
  @Field(() => [ScreenDto], { nullable: 'itemsAndList' })
  screens?: ScreenDto[]
}
