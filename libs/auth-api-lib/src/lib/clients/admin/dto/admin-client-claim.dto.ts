import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class AdminClientClaimDto {
  @ApiProperty({
    description:
      'The type of the claim use as the key in the JWT token along with client claim prefix.',
  })
  @IsString()
  type!: string

  @ApiProperty({
    description: 'The value of the claim.',
  })
  @IsString()
  value!: string
}
