import { InputType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

// @InputType()
export class EndorsementDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  showName!: boolean
}
