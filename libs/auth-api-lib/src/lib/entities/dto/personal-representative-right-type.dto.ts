import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class PersonalRepresentativeRightTypeDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'health_prescriptions',
  })
  readonly code!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'access to prescriptions through heilsuvera for example',
  })
  readonly description!: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() - 86400000)), //86400000 = nr of ms in one day
  })
  readonly validFrom?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)), //86400000 = nr of ms in one day
  })
  readonly validTo?: Date
}
