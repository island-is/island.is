import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { AdminClientType } from './admin-client-type.enum'

export class AdminCreateClientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '@domain.is/client-id',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsEnum(AdminClientType)
  @ApiProperty({
    example: 'spa',
    enum: AdminClientType,
  })
  readonly clientType!: AdminClientType

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Client name',
  })
  readonly clientName!: string
}
