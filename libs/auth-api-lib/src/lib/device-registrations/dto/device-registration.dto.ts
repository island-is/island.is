import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

export class SaveDeviceRegistrationDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  nationalId!: string

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  userSub!: string

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  clientId!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @ApiProperty()
  installKeyJwk!: string

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  installKeyThumbprint!: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiPropertyOptional({ nullable: true, type: String })
  biometricKeyJwk?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ nullable: true, type: String })
  biometricKeyThumbprint?: string | null

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  platform!: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ nullable: true, type: String })
  appAttestKeyId?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiPropertyOptional({ nullable: true, type: String })
  appAttestPublicKey?: string | null

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4_294_967_295)
  @ApiPropertyOptional({ nullable: true, type: Number })
  appAttestCounter?: number | null

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({ nullable: true, type: String })
  deviceName?: string | null

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  loginIdp!: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiPropertyOptional({ nullable: true, type: String })
  audkenniSimNumber?: string | null

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  developmentBuild?: boolean

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  lastUsed!: Date
}

export class UpdateDeviceRegistrationDto {
  /** The update applies only while the registration still has this install key. */
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @ApiProperty()
  installKeyThumbprint!: string

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiPropertyOptional({ nullable: true, type: String })
  biometricKeyJwk?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ nullable: true, type: String })
  biometricKeyThumbprint?: string | null

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  lastUsed!: Date
}

export class DeviceRegistrationDto extends SaveDeviceRegistrationDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  created!: Date
}
