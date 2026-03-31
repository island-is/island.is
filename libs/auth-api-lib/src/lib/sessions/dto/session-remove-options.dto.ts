import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class SessionRemoveOptions {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  count!: number
}
