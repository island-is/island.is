import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class OwnerInfoDto {
  @ApiProperty({nullable: true})
  @IsString()
  fullName!: string
}
