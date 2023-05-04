import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Column, DataType } from 'sequelize-typescript'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum RegistrationStatus {
  CREATED = 'CREATED',
  DELETED = 'DELETED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export class Registration {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty({
    description: 'Column description for id',
    example: 'Example value for id',
  })
  id!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(RegistrationStatus),
  })
  @ApiProperty({
    description: 'Column description for status',
    example: RegistrationStatus.CREATED,
    enum: RegistrationStatus,
  })
  status!: RegistrationStatus

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty({
    description: 'TBD',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  tbd?: string
}

export class RegistrationDto {
  @IsEnum(RegistrationStatus)
  @ApiProperty({
    description: 'Column description for status',
    example: RegistrationStatus.CREATED,
    enum: RegistrationStatus,
  })
  status!: RegistrationStatus

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'TBD',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  tbd?: string
}
