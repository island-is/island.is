import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AssignApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly token!: string
}
