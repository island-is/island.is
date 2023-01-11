import { IsArray, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'



export class createHnippNotificationDto {
  
  @IsNationalId()
  @ApiProperty({example:"1305775399"})
  recipient!: string

  @IsString()
  @ApiProperty({example:"HNIPP.FJARSYSLAN.NEW_STATUS_MESSAGE"})
  templateId!: string

  @IsArray()
  @ApiProperty({example:["arg1","arg2"]})
  args!: [string] | []

}