import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { ScreenDto } from '../../../screens/models/dto/screen.dto'
import { ApplicationXroadFieldDto } from './application.xroad.dto'

export class NotificationDto {
  @IsString()
  @Type(() => String)
  @Expose()
  @ApiProperty()
  applicationId!: string

  @IsString()
  @Type(() => String)
  @Expose()
  @ApiProperty()
  nationalId!: string

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
  screenDto?: ScreenDto

  @Type(() => ApplicationXroadFieldDto)
  @IsOptional()
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: [ApplicationXroadFieldDto] })
  fields?: ApplicationXroadFieldDto[]
}
