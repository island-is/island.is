import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SetActorProfileEmailDto {
  @ApiProperty({
    description: 'ID of the email to set on the actor profile',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsString()
  @IsNotEmpty()
  emailsId!: string
}
