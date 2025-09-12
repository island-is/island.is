import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

export class UpdateActorProfileEmailDto {
  @ApiPropertyOptional({
    description: 'Email to be updated or created',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string

  @ApiPropertyOptional({
    description: 'Email verification code to verify the email',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  emailVerificationCode?: string

  @ApiPropertyOptional({
    description: 'Whether the actor profile should receive email notifications',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean
}

export class ActorProfileEmailDto {
  @ApiProperty({
    description: 'ID of the email to set on the actor profile',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  emailsId!: string

  @ApiProperty({
    description: 'Email associated with the actor profile',
    example: 'john@example.com',
  })
  email!: string

  @ApiProperty({
    description: 'Status of the email',
    enum: DataStatus,
    example: DataStatus.VERIFIED,
  })
  @IsEnum(DataStatus)
  emailStatus!: DataStatus

  @ApiProperty({
    description: 'Whether the actor profile needs a nudge',
    example: false,
  })
  needsNudge!: boolean

  @ApiProperty({
    description: 'National ID of the actor',
    example: '1234567890',
  })
  nationalId!: string

  @ApiProperty({
    description: 'Whether the actor profile receives email notifications',
    example: true,
  })
  emailNotifications!: boolean
}
