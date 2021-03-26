import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class UserClaimDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'existing-resource-name',
  })
  resourceName!: string
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'new_claim',
  })
  claimName!: string
}
