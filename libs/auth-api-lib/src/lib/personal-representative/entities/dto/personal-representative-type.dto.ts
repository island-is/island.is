import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PersonalRepresentativeTypeDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'personal_representative_for_disabled_person',
  })
  readonly code!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Persónulegur talsmaður fatlaðs einstaklings',
  })
  readonly name!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Persónulegur talsmaður fatlaðs einstaklings, nánari lýsing',
  })
  readonly description!: string

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    // add one day as validTo example
    example: new Date(new Date().setTime(new Date().getTime() + 86400000)), //86400000 = nr of ms in one day
  })
  readonly validTo?: Date
}
