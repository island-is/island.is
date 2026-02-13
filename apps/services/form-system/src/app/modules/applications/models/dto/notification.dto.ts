import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'

export class NotificationDto {
  @IsString()
  @Type(() => String)
  @Expose()
  @ApiProperty()
  applicationId!: string

  @Type(() => String)
  @IsString()
  @Expose()
  @ApiProperty()
  slug!: string

  @Type(() => Boolean)
  @IsBoolean()
  @Expose()
  @ApiProperty()
  isTest!: boolean

  @Type(() => String)
  @IsString()
  @Expose()
  @ApiProperty()
  command!: string

  @Type(() => ScreenDto)
  @IsOptional()
  @Expose()
  @ValidateNested()
  @ApiPropertyOptional({ type: ScreenDto })
  screen?: ScreenDto
}

export class NotificationRequestDto {
  @Type(() => String)
  @IsString()
  @Expose()
  @ApiProperty()
  url!: string

  @ValidateNested()
  @Type(() => NotificationDto)
  @Expose()
  @ApiProperty({ type: NotificationDto })
  notificationDto!: NotificationDto
}
