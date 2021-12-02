import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class CreateUserNotificationDto {
    @ApiProperty({ required: true })
    @IsString()
    nationalId!: string

    @ApiProperty({ required: true })
    @IsString()
    device_token!: string

    @ApiProperty({ required: false })
    @IsBoolean()
    is_enabled?: boolean

}
