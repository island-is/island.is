import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateUserNotificationDto } from './create-user-notification.dto';

export class UpdateUserNotificationDto extends PartialType(CreateUserNotificationDto) {
    @ApiProperty({ required: true })
    @IsBoolean()
    is_enabled!: boolean
}
