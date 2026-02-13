import { Field, InputType } from '@nestjs/graphql'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

@InputType('FormSystemNotificationInput')
export class NotificationDto {
  @IsString()
  @Type(() => String)
  @Expose()
  @ApiProperty()
  @Field(() => String, { nullable: false })
  applicationId!: string

  @Type(() => String)
  @IsString()
  @Expose()
  @ApiProperty()
  @Field(() => String, { nullable: false })
  slug!: string

  @Type(() => Boolean)
  @IsBoolean()
  @Expose()
  @ApiProperty()
  @Field(() => Boolean, { nullable: false })
  isTest!: boolean

  @Type(() => String)
  @IsString()
  @Expose()
  @ApiProperty()
  @Field(() => String, { nullable: false })
  command!: string

  @Type(() => String)
  @IsOptional()
  @IsString()
  @Expose()
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  screenId?: string
}

@InputType('FormSystemNotificationRequestInput')
export class NotificationRequestDto {
  @Type(() => String)
  @IsString()
  @Expose()
  @ApiProperty()
  @Field(() => String, { nullable: false })
  url!: string

  @ValidateNested()
  @Type(() => NotificationDto)
  @Expose()
  @ApiProperty({ type: () => NotificationDto })
  @Field(() => NotificationDto, { nullable: false })
  notificationDto!: NotificationDto
}
