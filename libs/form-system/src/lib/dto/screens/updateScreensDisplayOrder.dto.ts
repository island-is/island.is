import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { ScreenDisplayOrderDto } from './screenDisplayOrder.dto'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

@InputType('FormSystemUpdateScreensDisplayOrder')
export class UpdateScreensDisplayOrderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ScreenDisplayOrderDto)
  @IsArray()
  @ApiProperty({ type: [ScreenDisplayOrderDto] })
  @Field(() => [ScreenDisplayOrderDto])
  screensDisplayOrderDto!: ScreenDisplayOrderDto[]
}

@InputType('FormSystemUpdateScreensDisplayOrderInput')
export class UpdateScreensDisplayOrderInput {
  @Field(() => UpdateScreensDisplayOrderDto)
  updateScreensDisplayOrderDto!: UpdateScreensDisplayOrderDto
}
