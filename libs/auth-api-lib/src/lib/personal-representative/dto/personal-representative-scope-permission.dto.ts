import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PersonalRepresentativeScopePermissionDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'health_prescriptions',
  })
  readonly permission!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '@island.is/applications:read for example',
  })
  readonly apiScopeName!: string
}
