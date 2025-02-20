import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ValueType } from '@island.is/form-system-dataTypes'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApplicationEventDto } from './applicationEvent.dto'

@ObjectType('FormSystemValue')
@InputType('FormSystemValueInput')
export class ValueDto {
  @ApiProperty()
  @Field(() => String)
  id!: string

  @ApiProperty()
  @Field(() => Number)
  order!: number

  @ApiPropertyOptional({ type: ValueType })
  @Field(() => ValueType, { nullable: true })
  json?: ValueType

  @ApiProperty({ type: [ApplicationEventDto] })
  @Field(() => [ApplicationEventDto], { nullable: 'itemsAndList' })
  events?: ApplicationEventDto[]
}
