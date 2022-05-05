import {
  IsNotEmpty,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'


export class CreateNotificationDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly title!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly content!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly action_url!: string

}
